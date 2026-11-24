"""Beginner-friendly document classifier: TF-IDF + Logistic Regression.
Trained on small labelled example phrases at import; replace with real labelled data later."""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
TRAIN = [
    ("hemoglobin white blood cell platelet complete blood count", "Complete Blood Count"),
    ("cholesterol triglycerides hdl ldl lipid profile", "Lipid Profile"),
    ("tsh t3 t4 thyroid stimulating hormone", "Thyroid Panel"),
    ("glucose sodium potassium metabolic panel creatinine", "Metabolic"),
    ("hemoglobin platelet mcv hematocrit cbc differential", "Complete Blood Count"),
    ("total cholesterol ldl hdl lipid", "Lipid Profile"),
]
_vectorizer = TfidfVectorizer()
_X = _vectorizer.fit_transform([t for t, _ in TRAIN])
_model = LogisticRegression(max_iter=1000).fit(_X, [y for _, y in TRAIN])
def classify_text(text: str) -> str:
    try: return str(_model.predict(_vectorizer.transform([text[:2000]]))[0])
    except Exception: return "Unknown"
