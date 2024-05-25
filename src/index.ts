import app from "./server";
import connect from "./database"; // Ensure this path is correct

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
connect();
