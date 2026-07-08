from .rules import RuleEngine
from .llm import LLMClient
from typing import Dict, Any

class AIOrchestrator:
    @staticmethod
    def process_inflow_pipeline(
        customer_name: str,
        risk_profile: str,
        inflow_amount_lakhs: float
    ) -> Dict[str, Any]:
        """
        Ingests a customer savings inflow trigger, evaluates compliance rules,
        runs LLM prompt briefs, and returns targeted recommendations parameters.
        """
        # 1. Run Inflow Rules
        rules_output = RuleEngine.evaluate_inflow(inflow_amount_lakhs)
        
        # 2. Match Target Investment Allocation Product
        product_output = RuleEngine.match_product(risk_profile)
        
        # 3. Generate Generative Wealth Briefing
        briefing_text = LLMClient.generate_briefing(
            customer_name=customer_name,
            risk_profile=risk_profile,
            readiness_score=rules_output["readiness_score"]
        )
        
        return {
            "is_eligible": rules_output["is_hni_ready"],
            "readiness_score": rules_output["readiness_score"],
            "confidence": rules_output["confidence_weight"],
            "title": product_output["title"],
            "target_allocation": product_output["target_allocation"],
            "expected_roi": product_output["expected_roi"],
            "notes": rules_output["evaluation_note"],
            "briefing": briefing_text
        }
