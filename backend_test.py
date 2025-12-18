#!/usr/bin/env python3
"""
CarePath Healthcare Navigation API Testing Suite
Tests all backend endpoints for the luxury healthcare navigation website
"""

import requests
import json
import sys
from datetime import datetime
import time

class CarePathAPITester:
    def __init__(self, base_url="https://medicalnav.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = None
        
    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")
        print()
        
    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                expected_message = "CarePath API - Healthcare Navigation System"
                success = data.get("message") == expected_message
                details = f"Status: {response.status_code}, Message: {data.get('message', 'N/A')}"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("API Root Endpoint", success, details)
            return success
            
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_symptom_analysis(self):
        """Test symptom analysis endpoint with AI integration"""
        try:
            # Test data
            test_symptoms = "I have a persistent headache and feel dizzy"
            test_language = "en"
            
            payload = {
                "symptoms": test_symptoms,
                "language": test_language
            }
            
            print(f"🔍 Testing symptom analysis with: '{test_symptoms}'")
            response = requests.post(
                f"{self.api_url}/analyze-symptom", 
                json=payload, 
                timeout=30  # AI calls can take longer
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                
                # Validate response structure
                required_fields = [
                    "session_id", "possible_conditions", "recommended_specialists",
                    "urgency_level", "confidence", "disclaimer"
                ]
                
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    success = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    # Store session_id for later tests
                    self.session_id = data.get("session_id")
                    
                    # Validate data types and content
                    conditions = data.get("possible_conditions", [])
                    specialists = data.get("recommended_specialists", [])
                    urgency = data.get("urgency_level", "")
                    confidence = data.get("confidence", "")
                    
                    validation_results = []
                    
                    if not isinstance(conditions, list):
                        validation_results.append("possible_conditions should be a list")
                    elif len(conditions) == 0:
                        validation_results.append("possible_conditions is empty")
                    
                    if not isinstance(specialists, list):
                        validation_results.append("recommended_specialists should be a list")
                    elif len(specialists) == 0:
                        validation_results.append("recommended_specialists is empty")
                    
                    valid_urgency = ["Emergency", "Consult Soon", "Routine"]
                    if urgency not in valid_urgency:
                        validation_results.append(f"Invalid urgency_level: {urgency}")
                    
                    valid_confidence = ["High", "Medium", "Low"]
                    if confidence not in valid_confidence:
                        validation_results.append(f"Invalid confidence: {confidence}")
                    
                    if validation_results:
                        success = False
                        details = f"Validation errors: {'; '.join(validation_results)}"
                    else:
                        details = f"✓ Conditions: {len(conditions)}, Specialists: {len(specialists)}, Urgency: {urgency}, Confidence: {confidence}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
                
            self.log_test("Symptom Analysis (AI Integration)", success, details)
            return success
            
        except Exception as e:
            self.log_test("Symptom Analysis (AI Integration)", False, f"Exception: {str(e)}")
            return False
    
    def test_doctors_endpoint(self):
        """Test doctors endpoint with specialist filtering"""
        try:
            # Test without specialists
            response = requests.get(f"{self.api_url}/doctors", timeout=10)
            success = response.status_code == 200
            
            if success:
                doctors = response.json()
                
                if not isinstance(doctors, list):
                    success = False
                    details = "Response should be a list of doctors"
                elif len(doctors) == 0:
                    success = False
                    details = "No doctors returned"
                else:
                    # Validate doctor structure
                    required_fields = [
                        "id", "name", "specialty", "experience_years", 
                        "rating", "distance", "availability", "hospital", "image_url"
                    ]
                    
                    first_doctor = doctors[0]
                    missing_fields = [field for field in required_fields if field not in first_doctor]
                    
                    if missing_fields:
                        success = False
                        details = f"Missing fields in doctor data: {missing_fields}"
                    else:
                        details = f"✓ {len(doctors)} doctors returned with complete data"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Doctors Endpoint (No Filter)", success, details)
            
            # Test with specialist filter
            if success:
                specialists = "Cardiologist,General Physician"
                response = requests.get(f"{self.api_url}/doctors?specialists={specialists}", timeout=10)
                filter_success = response.status_code == 200
                
                if filter_success:
                    filtered_doctors = response.json()
                    details = f"✓ {len(filtered_doctors)} doctors returned for specialists: {specialists}"
                else:
                    details = f"Status: {response.status_code}"
                
                self.log_test("Doctors Endpoint (With Filter)", filter_success, details)
                return success and filter_success
            
            return success
            
        except Exception as e:
            self.log_test("Doctors Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_care_pathway_endpoint(self):
        """Test care pathway endpoint"""
        try:
            # Test with different urgency levels
            urgency_levels = ["Emergency", "Consult Soon", "Routine"]
            all_success = True
            
            for urgency in urgency_levels:
                specialists = "General Physician,Cardiologist"
                response = requests.get(
                    f"{self.api_url}/care-pathway?urgency={urgency}&specialists={specialists}", 
                    timeout=10
                )
                
                success = response.status_code == 200
                
                if success:
                    pathway = response.json()
                    
                    # Validate pathway structure
                    required_fields = ["steps", "estimated_timeline", "follow_up_required"]
                    missing_fields = [field for field in required_fields if field not in pathway]
                    
                    if missing_fields:
                        success = False
                        details = f"Missing fields: {missing_fields}"
                    else:
                        steps = pathway.get("steps", [])
                        if not isinstance(steps, list) or len(steps) == 0:
                            success = False
                            details = "Steps should be a non-empty list"
                        else:
                            # Validate step structure
                            first_step = steps[0]
                            step_fields = ["step", "action", "description", "icon"]
                            missing_step_fields = [field for field in step_fields if field not in first_step]
                            
                            if missing_step_fields:
                                success = False
                                details = f"Missing step fields: {missing_step_fields}"
                            else:
                                details = f"✓ {len(steps)} steps, Timeline: {pathway.get('estimated_timeline')}"
                else:
                    details = f"Status: {response.status_code}"
                
                self.log_test(f"Care Pathway ({urgency})", success, details)
                all_success = all_success and success
            
            return all_success
            
        except Exception as e:
            self.log_test("Care Pathway Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_search_history(self):
        """Test search history endpoint if session_id is available"""
        if not self.session_id:
            self.log_test("Search History", False, "No session_id available from symptom analysis")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/search-history/{self.session_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                history = response.json()
                if isinstance(history, list):
                    details = f"✓ {len(history)} history entries retrieved"
                else:
                    success = False
                    details = "History should be a list"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Search History", success, details)
            return success
            
        except Exception as e:
            self.log_test("Search History", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🏥 CarePath Healthcare Navigation API Testing")
        print("=" * 60)
        print(f"Testing API at: {self.api_url}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test API availability first
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Run all endpoint tests
        tests = [
            self.test_symptom_analysis,
            self.test_doctors_endpoint,
            self.test_care_pathway_endpoint,
            self.test_search_history
        ]
        
        for test in tests:
            test()
            time.sleep(0.5)  # Small delay between tests
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests PASSED!")
            return True
        else:
            failed = self.tests_run - self.tests_passed
            print(f"⚠️  {failed} test(s) FAILED")
            return False

def main():
    """Main test execution"""
    tester = CarePathAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())