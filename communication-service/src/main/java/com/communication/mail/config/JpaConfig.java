/*
 * package com.communication.mail.config;
 * 
 * import java.util.Properties;
 * 
 * import javax.sql.DataSource;
 * 
 * import org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.context.annotation.Primary; import
 * org.springframework.jdbc.datasource.DriverManagerDataSource; import
 * org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean; import
 * org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
 * 
 * @Configuration public class JpaConfig {
 * 
 * @Bean(name = "entityManagerFactory")
 * 
 * @Primary public LocalContainerEntityManagerFactoryBean
 * entityManagerFactory(DataSource dataSource) {
 * LocalContainerEntityManagerFactoryBean emFactoryBean = new
 * LocalContainerEntityManagerFactoryBean();
 * 
 * // Set the data source emFactoryBean.setDataSource(dataSource);
 * 
 * // Set the package where your @Entity classes live
 * emFactoryBean.setPackagesToScan("com.communication.mail.entity");
 * 
 * // JPA vendor adapter HibernateJpaVendorAdapter vendorAdapter = new
 * HibernateJpaVendorAdapter(); vendorAdapter.setGenerateDdl(true);
 * vendorAdapter.setShowSql(true);
 * 
 * emFactoryBean.setJpaVendorAdapter(vendorAdapter);
 * 
 * // Additional JPA properties Properties jpaProperties = new Properties();
 * jpaProperties.setProperty("hibernate.hbm2ddl.auto", "update");
 * jpaProperties.setProperty("hibernate.dialect",
 * "org.hibernate.dialect.MySQL8Dialect");
 * 
 * emFactoryBean.setJpaProperties(jpaProperties);
 * 
 * return emFactoryBean; }
 * 
 * @Bean public DataSource dataSource() { DriverManagerDataSource dataSource =
 * new DriverManagerDataSource();
 * dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
 * dataSource.setUrl("jdbc:mysql://localhost:3306/hackathon_2025");
 * dataSource.setUsername("root"); dataSource.setPassword("root"); return
 * dataSource; }
 * 
 * 
 * }
 */