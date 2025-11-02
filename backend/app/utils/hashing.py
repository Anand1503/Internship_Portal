import bcrypt

def get_password_hash(password: str) -> str:
    # Bcrypt has a max password length of 72 bytes
    password_bytes = password[:72].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def hash_password(password: str) -> str:
    # Alias for get_password_hash
    return get_password_hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Bcrypt has a max password length of 72 bytes
    password_bytes = plain_password[:72].encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
