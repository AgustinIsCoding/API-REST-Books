import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
app.use(bodyParser.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js API with Swagger",
      version: "1.0.0",
      description: "A simple Express.js API with Swagger documentation",
    },
  },
  apis: ["./index.js"], // Specify the file where your routes are defined
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Returns a welcome message
 */
app.get("/", (req, res) => {
  res.send("Welcome to my Node JS API");
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: Returns the list of books
 */
app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a specific book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested book
 *       404:
 *         description: Book not found
 */
app.get("/books/:id",(req,res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book)=>book.id ===id);
    res.json(book);
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBook'
 *     responses:
 *       200:
 *         description: Returns the newly added book
 */
app.post("/books",(req,res)=>{
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length +1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
})

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBook'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
app.put("/books/:id",(req,res)=>{
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book)=>book.id ===id);
    data.books[bookIndex]={
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({message:"Book updated succesfully"})
})

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
app.delete("/books/:id",(req,res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book)=>book.id ===id);
    data.books.splice(bookIndex,1);
    writeData(data);
    res.json({message:"Book deleted succesfully"})
})

app.listen(3000, ()=>{
    console.log('Server listening on port 3000')
});