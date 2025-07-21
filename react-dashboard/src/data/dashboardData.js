// Data and mock API for Dashboard

export const dateOptions = [
  '2024-06-01',
  '2024-06-02',
  '2024-06-03',
  '2024-06-04'
];

export const mockApi = (date) => {
  // Simulate API call based on date
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Alice Johnson',
          grade: 'A',
          joiningDate: date,
          state: 'Maharashtra',
          status: 'Ready',
          readyToJoin: true,
          description: 'Frontend Developer'
        },
        {
          id: 2,
          name: 'Bob Smith',
          grade: 'B',
          joiningDate: date,
          state: 'Karnataka',
          status: 'Document Pending',
          readyToJoin: false,
          description: 'Backend Developer'
        },
        {
          id: 3,
          name: 'Carol Lee',
          grade: 'A',
          joiningDate: date,
          state: 'Delhi',
          status: 'Ready',
          readyToJoin: true,
          description: 'Fullstack Developer'
        },
        {
          id: 4,
          name: 'David Brown',
          grade: 'C',
          joiningDate: date,
          state: 'Tamil Nadu',
          status: 'Medical Pending',
          readyToJoin: false,
          description: 'QA Engineer'
        },
        {
          id: 5,
          name: 'Eva Green',
          grade: 'B',
          joiningDate: date,
          state: 'Gujarat',
          status: 'Ready',
          readyToJoin: true,
          description: 'DevOps Engineer'
        },
        {
          id: 6,
          name: 'Frank White',
          grade: 'A',
          joiningDate: date,
          state: 'West Bengal',
          status: 'Ready',
          readyToJoin: true,
          description: 'UI/UX Designer'
        },
        {
          id: 7,
          name: 'Grace Kim',
          grade: 'B',
          joiningDate: date,
          state: 'Kerala',
          status: 'Document Pending',
          readyToJoin: false,
          description: 'Data Analyst'
        },
        {
          id: 8,
          name: 'Henry Ford',
          grade: 'C',
          joiningDate: date,
          state: 'Punjab',
          status: 'Ready',
          readyToJoin: true,
          description: 'Support Engineer'
        },
        {
          id: 9,
          name: 'Ivy Chan',
          grade: 'A',
          joiningDate: date,
          state: 'Rajasthan',
          status: 'Ready',
          readyToJoin: true,
          description: 'Cloud Engineer'
        },
        {
          id: 10,
          name: 'Jack Black',
          grade: 'B',
          joiningDate: date,
          state: 'Uttar Pradesh',
          status: 'Medical Pending',
          readyToJoin: false,
          description: 'Network Engineer'
        },
      ]);
    }, 500);
  });
};
