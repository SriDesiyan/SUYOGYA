from typing import Dict, Any

class RuleEngine:
    @staticmethod
    def evaluate_inflow(amount_lakhs: float) -> Dict[str, Any]:
        """
        Evaluate if savings credit inflow triggers HNI advisory readiness.
        """
        is_hni_ready = amount_lakhs >= 20.0 # Trigger threshold 20 Lakhs
        readiness_score = 90.0 if amount_lakhs >= 50.0 else (80.0 if is_hni_ready else 45.0)
        
        return {
            "is_hni_ready": is_hni_ready,
            "readiness_score": readiness_score,
            "confidence_weight": 95.0 if is_hni_ready else 60.0,
            "evaluation_note": f"Savings inflow credit size: ₹{amount_lakhs}L."
        }

    @staticmethod
    def match_product(risk_profile: str) -> Dict[str, Any]:
        """
        Match specific mutual fund or portfolio products based on HNI risk profile.
        """
        profile = risk_profile.lower()
        if "aggressive" in profile:
            return {
                "title": "Bluechip Portfolio Management Services (PMS)",
                "target_allocation": 120.0,
                "expected_roi": 14.5,
            }
        elif "conservative" in profile or "balanced" in profile:
            return {
                "title": "Sovereign Gold Bonds & Yield Deposits",
                "target_allocation": 85.0,
                "expected_roi": 8.2,
            }
        else:
            return {
                "title": "SBI Centralized Diversified Growth Fund",
                "target_allocation": 100.0,
                "expected_roi": 11.2,
            }
