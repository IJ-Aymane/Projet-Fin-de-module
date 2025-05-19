import bcrypt

# Hash du mot de passe stocké dans la base de données
hashed_password = "$2b$12$fsDw8TMi8.69K6vIhDyqMux9FNK9/as31pIND.t7MGefBEczQkpui"
hashed_password_bytes = hashed_password.encode('utf-8')

# Générons un nouveau mot de passe et vérifions s'il correspond au hash
def create_matching_password():
    # Créons un nouveau mot de passe
    password = "asmae123"
    password_bytes = password.encode('utf-8')
    
    # Générons un hash pour ce mot de passe
    new_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt(12))
    
    print(f"Mot de passe: {password}")
    print(f"Nouveau hash généré: {new_hash.decode('utf-8')}")
    
    # Vérifions si notre mot de passe correspond au hash stocké
    is_valid = bcrypt.checkpw(password_bytes, hashed_password_bytes)
    print(f"Correspondance avec le hash stocké: {is_valid}")

# Testons un mot de passe spécifique avec le hash stocké
def check_specific_password(password):
    password_bytes = password.encode('utf-8')
    is_valid = bcrypt.checkpw(password_bytes, hashed_password_bytes)
    print(f"Le mot de passe '{password}' correspond au hash: {is_valid}")

# Test avec quelques mots de passe communs
print("Vérification avec quelques mots de passe communs:")
common_passwords = ["admin", "password", "123456", "qwerty", "welcome", "admin123456", "administrator"]
for password in common_passwords:
    check_specific_password(password)

# Créons aussi un nouveau mot de passe et son hash
print("\nCréation d'un nouveau mot de passe:")
create_matching_password()