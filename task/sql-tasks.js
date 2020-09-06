'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID AS "Order Id",
            sum(UnitPrice * Quantity) AS "Order Total Price",
            ROUND(SUM(Discount * Quantity)/SUM(UnitPrice * Quantity) * 100,3) AS "Total Order Discount, %"
        FROM OrderDetails
        GROUP BY OrderID 
        ORDER BY OrderID DESC;
    `);

    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT 
            CustomerId,
            CompanyName
        FROM Customers
        WHERE Country = "USA" AND Fax IS null;
    `);

    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
            CustomerID AS "Customer Id",
            COUNT(CustomerID) AS "Total number of Orders",
            ROUND(COUNT(*) / SUM(COUNT(*)) OVER() * 100, 5) AS "% of all orders"    
        FROM Orders
        GROUP BY CustomerID
        ORDER BY 3 DESC, CustomerID ASC
    `);
    
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT 
            ProductId,
            ProductName,
            QuantityPerUnit    
        FROM Products
        WHERE ProductName BETWEEN "A" AND "G"
        ORDER BY ProductName
    `);
    
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT 
            ProductName,
            CategoryName,
            CompanyName AS "SupplierCompanyName"
        FROM Products
        JOIN Categories ON Products.CategoryID = Categories.CategoryID
        JOIN Suppliers ON Products.SupplierID = Suppliers.SupplierID
        ORDER BY ProductName, SupplierCompanyName
    `);
    
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT
            employee1.EmployeeId AS "EmployeeId",
            concat( employee1.FirstName, " ", employee1.LastName) AS "FullName",
            COALESCE(concat( employee2.FirstName, " ", employee2.LastName), "-") AS "ReportsTo"
        FROM Employees employee2
        RIGHT JOIN Employees employee1 ON employee2.EmployeeID = employee1.ReportsTo
        ORDER BY employee1.EmployeeID
    `);

    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT 
            CategoryName,
            COUNT(*) AS "TotalNumberOfProducts"
        FROM Categories
        LEFT JOIN Products ON Products.CategoryID = Categories.CategoryID
        GROUP BY Categories.CategoryID;
    `);

    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT 
            CustomerID,
            ContactName
        FROM Customers
        WHERE ContactName LIKE "F%___n%"
    `);

    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
            ProductID,
            ProductName
        FROM Products
        WHERE Discontinued > 0
    `);

    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT 
            ProductName,
            UnitPrice
        FROM Products
        WHERE UnitPrice between 5 AND 15
        ORDER BY UnitPrice, ProductName
    `);

    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT 	
            ProductName,
            UnitPrice
        FROM (SELECT * FROM Products ORDER BY UnitPrice DESC LIMIT 20) T
        ORDER BY UnitPrice ASC, ProductName ASC
    `);

    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT
	        COUNT(ProductName) AS "TotalOfCurrentProducts",
	        SUM(Discontinued) AS "TotalOfDiscontinuedProducts"
        FROM Products;
    `);

    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT 
	        ProductName,
	        UnitsOnOrder,
	        UnitsInStock
        FROM Products
	    WHERE UnitsInStock < UnitsOnOrder
    `);

    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            SUM(MONTH(OrderDate) = "1") AS "January",
            SUM(MONTH(OrderDate) = "2") AS "February",
            SUM(MONTH(OrderDate) = "3") AS "March",
            SUM(MONTH(OrderDate) = "4") AS "April",
            SUM(MONTH(OrderDate) = "5") AS "May",
            SUM(MONTH(OrderDate) = "6") AS "June",
            SUM(MONTH(OrderDate) = "7") AS "July",
            SUM(MONTH(OrderDate) = "8") AS "August",
            SUM(MONTH(OrderDate) = "9") AS "September",
            SUM(MONTH(OrderDate) = "10") AS "October",
            SUM(MONTH(OrderDate) = "11") AS "November",
            SUM(MONTH(OrderDate) = "12") AS "December"    
        FROM Orders
        WHERE YEAR(OrderDate) = "1997"
    `);

    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT 
	        OrderID,
	        CustomerID,
            ShipCountry
        FROM Orders
	    WHERE ShipPostalCode IS NOT null
    `);

    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT 
            categories.CategoryName, 
            AVG(products.UnitPrice) AS "AvgPrice"
        FROM Categories categories
        INNER JOIN Products products ON categories.CategoryID = products.CategoryID
        GROUP BY categories.CategoryName
        ORDER BY AvgPrice DESC, categories.CategoryName;
    `);

    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT DATE_FORMAT(OrderDate, '%Y-%m-%d %T') AS "OrderDate", COUNT(*) AS "Total Number of Orders"
        FROM Orders
        WHERE YEAR(OrderDate) = "1998"
        GROUP BY OrderDate;
    `);

    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
    SELECT
        orders.CustomerID,
        customers.CompanyName,
        SUM(orderdetails.Quantity * orderdetails.UnitPrice) AS "TotalOrdersAmount, $"
    FROM Orders orders
	JOIN Customers customers ON customers.CustomerID = orders.CustomerID
    JOIN OrderDetails orderdetails ON orderdetails.OrderID = orders.OrderID
    group by 1
    HAVING SUM(orderdetails.Quantity * orderdetails.UnitPrice) > 10000
    ORDER BY 3 DESC, 1 DESC
    `);

    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT
            employees.EmployeeID,
            concat(employees.FirstName, " ", employees.LastName) AS "Employee Full Name",
            SUM(orderdetails.UnitPrice * orderdetails.Quantity) AS "Amount, $"
        FROM Employees employees
        JOIN Orders orders ON orders.EmployeeID = employees.EmployeeID
        JOIN OrderDetails orderdetails ON orderdetails.OrderID = orders.OrderID
        GROUP BY 1
        ORDER BY 3 DESC LIMIT 1
    `);

    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
            OrderID,
            SUM(UnitPrice * Quantity) AS "Maximum Purchase Amount, $"
        FROM OrderDetails
        GROUP BY 1
        ORDER BY 2 DESC LIMIT 1
    `);

    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT DISTINCT
            Customers.CompanyName,
            Products.ProductName,
            OrderDetails.UnitPrice AS "PricePerItem"
        FROM Customers 
        JOIN Orders ON Customers.CustomerID = Orders.CustomerID
        JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
        JOIN Products ON OrderDetails.ProductID = Products.ProductID
        WHERE OrderDetails.UnitPrice = 
            (SELECT
                MAX(orderdetails.UnitPrice)
            FROM Customers customers1
            JOIN Orders orders ON orders.CustomerID = customers1.CustomerID
            JOIN OrderDetails orderdetails ON orderdetails.OrderID = orders.OrderID
            WHERE Customers.CompanyName = customers1.CompanyName
            )        
        ORDER BY 3 DESC, 1, 2;
    `);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
