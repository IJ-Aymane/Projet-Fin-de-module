from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the FastAPI app!"}

def test_register_and_login():
    # Test register
    register_response = client.post(
        "/register",
        json={"username": "newuser", "email": "new@example.com", "password": "newpassword"}
    )
    assert register_response.status_code == 200
    assert register_response.json()["username"] == "newuser"
    
    # Test login
    login_response = client.post(
        "/token",
        data={"username": "newuser", "password": "newpassword"}
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    token = login_response.json()["access_token"]
    
    # Test get current user
    me_response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["username"] == "newuser"

def test_update_user():
    # First login
    login_response = client.post(
        "/token",
        data={"username": "testuser", "password": "password123"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Update user
    update_response = client.put(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"username": "updateduser"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["username"] == "updateduser"