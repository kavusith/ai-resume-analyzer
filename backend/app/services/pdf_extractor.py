import PyPDF2
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from PDF bytes."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {str(e)}")