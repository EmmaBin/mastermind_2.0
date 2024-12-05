# test cases for /register
from app import app
import unittest
from unittest.mock import patch


class TestRegisterEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    @patch('app.connect_with_db')
    def test_register_success(self, mock_connect):
        mock_connection = mock_connect.return_value
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = None

        response = self.client.post('/register', json={
            "userName": "testuser",
            "userPassword": "securepassword",
            "userEmail": "testuser@example.com"
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn("User registered successfully!",
                      response.get_json()["message"])

    @patch('app.connect_with_db')
    def test_register_email_exists(self, mock_connect):
        mock_connection = mock_connect.return_value
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = (
            1, "existinguser", "testuser@example.com")

        response = self.client.post('/register', json={
            "userName": "newuser",
            "userPassword": "securepassword",
            "userEmail": "testuser@example.com"
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn("Email already exists", response.get_json()["error"])

    def test_register_missing_fields(self):
        response = self.client.post('/register', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing required fields", response.get_json()["error"])
