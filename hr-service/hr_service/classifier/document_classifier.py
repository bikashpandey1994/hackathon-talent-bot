from transformers import AutoModel
from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
import torch
import pytesseract
from pytesseract import Output
import torch.nn as nn
import torch.nn.functional as F

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# Set apply_ocr=False to allow passing custom words and boxes
processor = LayoutLMv3Processor.from_pretrained(
    "microsoft/layoutlmv3-base", apply_ocr=False)
model = LayoutLMv3ForTokenClassification.from_pretrained(
    "microsoft/layoutlmv3-base")
embedding_model = AutoModel.from_pretrained("microsoft/layoutlmv3-base")


def preprocess_document(image):
    """
    Extract words and bounding boxes from an image using pytesseract.
    Args:
        image: PIL.Image of the document.
    Returns:
        words: List of words detected in the image.
        boxes: List of bounding boxes for each word, normalized to 0-1000 scale.
    """
    data = pytesseract.image_to_data(image, output_type=Output.DICT)
    words = []
    boxes = []
    width, height = image.size

    for i in range(len(data['text'])):
        word = data['text'][i]
        if word.strip() != "":
            x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
            # Normalize to 0-1000 scale
            x0 = int(1000 * x / width)
            y0 = int(1000 * y / height)
            x1 = int(1000 * (x + w) / width)
            y1 = int(1000 * (y + h) / height)
            words.append(word)
            boxes.append([x0, y0, x1, y1])
    return words, boxes


def extract_layoutlmv3_embeddings(image, words, boxes):
    """
    Extract embeddings from LayoutLMv3 for a given document image, words, and bounding boxes.
    Args:
        image: PIL.Image of the document.
        words: List of words in the document.
        boxes: List of bounding boxes for each word (in 4-point format).
    Returns:
        embeddings: torch.Tensor of shape (batch_size, sequence_length, hidden_size)
    """
    # Preprocess the inputs
    encoding = processor(image, words, boxes=boxes,
                         return_tensors="pt", truncation=True, padding="max_length")
    # Get embeddings from the model
    with torch.no_grad():
        outputs = embedding_model(**encoding)
        # (batch_size, seq_len, hidden_size)
        embeddings = outputs.last_hidden_state
    return embeddings

# Dummy classifier for demonstration (should be trained with real data)


class SimpleDocClassifier(nn.Module):
    def __init__(self, embedding_dim, num_classes=3):
        super().__init__()
        self.fc = nn.Linear(embedding_dim, num_classes)

    def forward(self, x):
        # x: (batch_size, seq_len, embedding_dim)
        # Use [CLS] token embedding (first token)
        cls_emb = x[:, 0, :]  # (batch_size, embedding_dim)
        logits = self.fc(cls_emb)
        return logits


# Instantiate the classifier (embedding_dim=768 for layoutlmv3-base)
classifier = SimpleDocClassifier(embedding_dim=768)
# TODO: Load trained weights for real use


def classify_document_embeddings(embeddings, threshold=0.33):
    """
    Classify document based on LayoutLMv3 embeddings.
    Args:
        embeddings: torch.Tensor of shape (batch_size, seq_len, hidden_size)
        threshold: Probability threshold for classification
    Returns:
        label: One of "PAN card", "Adhaar Card", "Voter ID", or "Unknown"
    """
    classifier.eval()
    with torch.no_grad():
        logits = classifier(embeddings)
        probs = F.softmax(logits, dim=-1)
        max_prob, pred = torch.max(probs, dim=-1)
        pred = pred.item()
        max_prob = max_prob.item()
        label_map = {0: "Adhaar Card", 1: "Voter ID", 2: "PAN Card"}
        if max_prob < threshold:
            return "Unknown"
        return label_map[pred]


def train_classifier(image_label_pairs, num_epochs=5, lr=1e-4):
    """
    Train the document classifier.
    Args:
        image_label_pairs: List of tuples (PIL.Image, label_index)
        num_epochs: Number of training epochs
        lr: Learning rate
    """
    optimizer = torch.optim.Adam(classifier.parameters(), lr=lr)
    loss_fn = nn.CrossEntropyLoss()
    classifier.train()

    for epoch in range(num_epochs):
        total_loss = 0
        for image, label in image_label_pairs:
            words, boxes = preprocess_document(image)
            embeddings = extract_layoutlmv3_embeddings(image, words, boxes)
            logits = classifier(embeddings)
            target = torch.tensor([label])
            loss = loss_fn(logits, target)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(
            f"Epoch {epoch+1}/{num_epochs}, Loss: {total_loss/len(image_label_pairs):.4f}")

    # Save the trained model
    torch.save(classifier.state_dict(), "simple_doc_classifier.pth")


def load_trained_classifier(path="simple_doc_classifier.pth"):
    classifier.load_state_dict(torch.load(path))
    classifier.eval()