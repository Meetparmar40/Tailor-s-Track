# Tailor Track (React)

Tailor Track is a web application for managing tailoring orders, customers, and measurements. It is built using the MERN stack (PostgreSQL, Express, React, Node.js).

## Project Structure

- **Backend**: Node.js/Express server with PostgreSQL database.
- **Frontend**: React application using Vite, Tailwind CSS, and Zustand for state management.

## Class Diagram

The following diagram illustrates the key entities in the backend, the state management stores in the frontend, and the main React components.

```mermaid
classDiagram
    note "Backend Entities (PostgreSQL)"
    class User {
        +UUID id
        +String email
        +String password_hash
        +createUser()
    }
    class Customer {
        +UUID id
        +UUID user_id
        +String name
        +String phone
        +String email
        +String notes
        +String gender
        +createCustomer()
        +updateCustomer()
        +deleteCustomer()
        +getAllCustomers()
    }
    class Order {
        +UUID id
        +UUID customer_id
        +UUID user_id
        +String type
        +Integer quantity
        +String status
        +DateTime order_date
        +DateTime updated_at
        +DateTime due_date
        +String notes
        +Integer tag
        +createOrder()
        +updateOrder()
        +deleteOrder()
        +getAllOrders()
    }
    class Measurement {
        +UUID id
        +UUID customer_id
        +String type
        +JSON data
        +DateTime updated_at
        +createMeasurement()
        +updateMeasurement()
        +deleteMeasurement()
        +getAllMeasurements()
    }

    User "1" -- "*" Customer : has
    User "1" -- "*" Order : manages
    Customer "1" -- "*" Order : places
    Customer "1" -- "*" Measurement : has

    note "Frontend Stores (Zustand)"
    class useCustomersStore {
        +Array customers
        +Boolean loading
        +String error
        +fetchCustomers()
        +fetchMoreCustomers()
        +updateCustomer()
        +deleteCustomer()
    }
    class useOrdersStore {
        +Array orders
        +Boolean loading
        +String error
        +fetchOrders()
        +fetchMoreOrders()
        +fetchOrdersOfCustomer()
        +addOrder()
        +deleteOrder()
    }
    class useMeasurementsStore {
        +Array measurements
        +Array allMeasurements
        +Boolean loading
        +String error
        +fetchAllMeasurements()
        +fetchMeasurementsOfCustomer()
    }

    note "Frontend Controllers (Hooks)"
    class useCustomerSheetController {
        +Object customerForm
        +Object orderForm
        +Array customerOrders
        +handleSaveCustomer()
        +handleSaveOrder()
        +deleteOrder()
    }
    class useOrderSheetController {
        +Object orderForm
        +handleSaveAll()
    }

    note "Frontend Components"
    class App {
        +render()
    }
    class CustomersPage {
        +render()
    }
    class MeasurementsPage {
        +render()
    }
    class HomePage {
        +render()
    }
    class CustomerListView {
        +render()
    }
    class OrderListView {
        +render()
    }
    class KanbanBoard {
        +render()
    }
    class OrderCard {
        +render()
    }
    class SheetViewWrapper {
        +render()
    }
    class CustomerSheetView {
        +render()
    }
    class OrderSheetView {
        +render()
    }

    App --> CustomersPage
    App --> MeasurementsPage
    App --> HomePage
    
    CustomersPage --> CustomerListView
    CustomersPage --> SheetViewWrapper
    
    HomePage --> OrderListView
    HomePage --> KanbanBoard
    HomePage --> SheetViewWrapper
    
    KanbanBoard --> OrderCard
    OrderListView --> OrderCard
    
    SheetViewWrapper --> CustomerSheetView
    SheetViewWrapper --> OrderSheetView
    
    CustomerSheetView ..> useCustomerSheetController : uses
    OrderSheetView ..> useOrderSheetController : uses
    
    useCustomersStore -- CustomersPage : provides data
    useOrdersStore -- HomePage : provides data
    useMeasurementsStore -- MeasurementsPage : provides data
    
    useCustomerSheetController ..> useCustomersStore : interacts
    useCustomerSheetController ..> useOrdersStore : interacts
    useCustomerSheetController ..> useMeasurementsStore : interacts
    
    useOrderSheetController ..> useOrdersStore : interacts
    useOrderSheetController ..> useCustomersStore : interacts
    useOrderSheetController ..> useMeasurementsStore : interacts
```
