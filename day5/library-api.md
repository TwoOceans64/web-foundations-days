# Library Books API

## Endpoints

- **GET /books**  
  List all books.  
  Success: 200

- **GET /books/{id}**  
  Get details of one book by ID.  
  Success: 200

- **POST /books**  
  Create a new book.  
  Request body:  
  ```json
  { "title": "Book Title", "author": "Author Name", "year": 2024 }
Success: 201

PUT /books/{id}  
Update an existing book (replace all fields).
Request body:

json
{ "title": "Updated Title", "author": "Updated Author", "year": 2025 }
Success: 200

PATCH /books/{id}  
Update part of a book (e.g., just the year).
Request body:

json
{ "year": 2026 }
Success: 200

DELETE /books/{id}  
Delete a book by ID.
Success: 204

GET /books?author=Name  
List all books by a specific author using a query parameter.
Success: 200

Error Codes
400 Bad Request — Example: missing required field in POST body.

404 Not Found — Example: requesting a book ID that does not exist.