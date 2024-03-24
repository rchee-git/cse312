def check_pass(password, confirm):
    special_characters = "!@#$%^&()_-="
    if password != confirm:
        return False, "Passwords do not match."
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    # Flags for each password requirement
    uppercase = any(character.isupper() for character in password)
    lowercase = any(character.islower() for character in password)
    special = any(character in special_characters for character in password)
    number = any(character.isdigit() for character in password)

    # If any condition is not fulfilled, return False with a message
    if not (uppercase and lowercase and special and number):
        return (
            False,
            "Password must contain an uppercase letter, a lowercase letter, a number, and a special character.",
        )

    return True, "Password is valid."
