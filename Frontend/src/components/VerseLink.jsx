import { Link } from "react-router-dom";

// A verse reference (e.g. "John 3:16") that, when clicked, takes the
// reader straight to that exact verse on the Bible page — highlighted
// and scrolled into view. bookId must match an id in src/data/bible/books.json.
const VerseLink = ({ book, chapter, verse, children }) => (
  <Link
    to={`/bible?book=${book}&chapter=${chapter}&verse=${verse}`}
    className="text-cyan-300 underline decoration-cyan-500/50 hover:text-cyan-200 font-medium"
  >
    {children}
  </Link>
);

export default VerseLink;
