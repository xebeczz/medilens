"""Modular educational explanations. No diagnosis, prescription or treatment advice."""
EXPLANATIONS = {
    "Hemoglobin": ("Hemoglobin carries oxygen in red blood cells. A value inside the laboratory reference range is a routine finding on this report.", "Hydration, altitude, recent exertion and laboratory method can shift the value slightly.", "Is this value stable compared with my previous results?"),
    "White Blood Cell (WBC)": ("White blood cells are part of the immune system. A value inside the reference range is a routine finding.", "Recent infection, stress, exercise and some medicines can raise or lower WBC.", "Should this be repeated if I develop new symptoms?"),
    "Platelet Count": ("Mild thrombocytopenia. Values between 100-149 x10^3/uL are frequently incidental, transient, or associated with recent viral infections, localized platelet clumping in EDTA tubes (pseudothrombocytopenia), or medication effects.", "EDTA-related clumping, recent viral illness and some medicines can lower the count.", "Would a repeat CBC with sodium citrate tube be advisable to rule out in vitro platelet agglutination?"),
    "Mean Corpuscular Volume (MCV)": ("MCV is the average size of red blood cells. A value inside the reference range is a routine finding.", "Iron, B12 and folate status can affect red-cell size over time.", "Does this fit with my hemoglobin and red-cell count?"),
    "Fasting Glucose": ("This fasting glucose is above the reference range printed on the report. A single above-range value does not by itself establish a diagnosis — fasting status, recent illness, stress and medicines all matter, and laboratories usually repeat the test.", "Fasting duration, recent food or drink, illness, stress and some medicines.", "Was I fully fasting, and should this be repeated?"),
    "Red Blood Cell Count": ("Red blood cell count inside the reference range is a routine finding on this report.", "Hydration and altitude can shift the count slightly.", "How does this compare with my last CBC?"),
    "Hematocrit": ("Hematocrit is the proportion of blood made up of red blood cells. Inside the reference range here.", "Hydration status is the most common short-term influence.", "Is this consistent with my hemoglobin?"),
}
def explain(result):
    exp, factors, q = EXPLANATIONS.get(result.test_name, ("Educational note: compare this value with the reference range printed on the original report and discuss it with a clinician.", "Laboratory method and sample handling can affect results.", "Should this value be repeated or compared with earlier results?"))
    return {"test_name": result.test_name, "measured_value": result.measured_value, "unit": result.unit,
            "reference_text": result.original_reference_text, "status": result.result_status,
            "explanation": exp, "factors": factors, "question": q}
