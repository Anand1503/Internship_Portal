"""
Seed script to populate the database with synthetic data
Run with: python seed_data.py
"""
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.models.internship import Internship
from app.models.resume import Resume
from app.models.application import Application
from app.utils.hashing import get_password_hash
import random

def seed_database():
    db = SessionLocal()
    
    try:
        print("Starting database seeding...")
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        print("Clearing existing data...")
        db.query(Application).delete()
        db.query(Resume).delete()
        db.query(Internship).delete()
        db.query(Company).delete()
        db.query(User).delete()
        db.commit()
        
        # 1. Create Users (Students and HR)
        print("\nCreating users...")
        
        # Students
        students = [
            {"name": "Alice Johnson", "email": "alice@student.com", "role": "student"},
            {"name": "Bob Smith", "email": "bob@student.com", "role": "student"},
            {"name": "Charlie Brown", "email": "charlie@student.com", "role": "student"},
            {"name": "Diana Prince", "email": "diana@student.com", "role": "student"},
            {"name": "Ethan Hunt", "email": "ethan@student.com", "role": "student"},
            {"name": "Fiona Green", "email": "fiona@student.com", "role": "student"},
            {"name": "George Wilson", "email": "george@student.com", "role": "student"},
            {"name": "Hannah Lee", "email": "hannah@student.com", "role": "student"},
        ]
        
        # HR Users
        hr_users = [
            {"name": "John Recruiter", "email": "john@hr.com", "role": "hr"},
            {"name": "Sarah Manager", "email": "sarah@hr.com", "role": "hr"},
            {"name": "Mike Director", "email": "mike@hr.com", "role": "hr"},
        ]
        
        # Add default test accounts
        students.insert(0, {"name": "Test Student", "email": "student@test.com", "role": "student"})
        hr_users.insert(0, {"name": "Test HR", "email": "hr@test.com", "role": "hr"})
        
        created_students = []
        for student_data in students:
            user = User(
                name=student_data["name"],
                email=student_data["email"],
                hashed_password=get_password_hash("password123"),
                role=student_data["role"]
            )
            db.add(user)
            db.flush()
            created_students.append(user)
            print(f"  + Created student: {user.name} ({user.email})")
        
        created_hr = []
        for hr_data in hr_users:
            user = User(
                name=hr_data["name"],
                email=hr_data["email"],
                hashed_password=get_password_hash("password123"),
                role=hr_data["role"]
            )
            db.add(user)
            db.flush()
            created_hr.append(user)
            print(f"  + Created HR: {user.name} ({user.email})")
        
        db.commit()
        
        # 2. Create Companies
        print("\nCreating companies...")
        companies_data = [
            {"name": "TechCorp Inc."},
            {"name": "DataSystems LLC"},
            {"name": "CloudNine Technologies"},
            {"name": "InnovateLab"},
            {"name": "StartupHub"},
            {"name": "FinTech Solutions"},
        ]
        
        created_companies = []
        for company_data in companies_data:
            company = Company(**company_data)
            db.add(company)
            db.flush()
            created_companies.append(company)
            print(f"  + Created company: {company.name}")
        
        db.commit()
        
        # 3. Create Internships
        print("\nCreating internships...")
        internship_templates = [
            {
                "title": "Software Engineering Intern",
                "location": "San Francisco, CA",
                "stipend": 2500.0,
                "description": "Work on cutting-edge web applications using React and Node.js. Collaborate with senior engineers on real-world projects.",
                "min_qualifications": "Currently pursuing CS degree, Basic knowledge of JavaScript, Git experience",
                "expected_qualifications": "Experience with React, Node.js, or similar frameworks, Strong problem-solving skills"
            },
            {
                "title": "Data Science Intern",
                "location": "New York, NY",
                "stipend": 3000.0,
                "description": "Analyze large datasets and build machine learning models. Work with Python, TensorFlow, and cloud platforms.",
                "min_qualifications": "Statistics or CS background, Python programming, Basic ML knowledge",
                "expected_qualifications": "Experience with pandas, scikit-learn, TensorFlow, SQL skills"
            },
            {
                "title": "Product Management Intern",
                "location": "Remote",
                "stipend": 2000.0,
                "description": "Assist in product development lifecycle. Conduct user research and create product roadmaps.",
                "min_qualifications": "Business or technical degree, Communication skills, Analytical thinking",
                "expected_qualifications": "Previous PM experience, Agile methodology knowledge, UX understanding"
            },
            {
                "title": "UI/UX Design Intern",
                "location": "Austin, TX",
                "stipend": 2200.0,
                "description": "Design user interfaces for mobile and web applications. Create wireframes, prototypes, and design systems.",
                "min_qualifications": "Design portfolio, Figma or Sketch experience, Basic HTML/CSS",
                "expected_qualifications": "Strong portfolio, User research experience, Prototyping skills"
            },
            {
                "title": "DevOps Engineering Intern",
                "location": "Seattle, WA",
                "stipend": 2800.0,
                "description": "Work on CI/CD pipelines, cloud infrastructure, and automation. Learn Docker, Kubernetes, and AWS.",
                "min_qualifications": "Linux basics, Scripting knowledge, CS fundamentals",
                "expected_qualifications": "Docker experience, AWS/GCP knowledge, Python or Bash scripting"
            },
            {
                "title": "Marketing Intern",
                "location": "Boston, MA",
                "stipend": 1800.0,
                "description": "Support digital marketing campaigns. Create content, analyze metrics, and manage social media.",
                "min_qualifications": "Marketing or Communications major, Writing skills, Social media knowledge",
                "expected_qualifications": "SEO/SEM experience, Analytics tools, Content creation"
            },
            {
                "title": "Cybersecurity Intern",
                "location": "Washington, DC",
                "stipend": 3200.0,
                "description": "Learn security best practices, conduct vulnerability assessments, and assist in incident response.",
                "min_qualifications": "CS or Security background, Networking basics, Security interest",
                "expected_qualifications": "Security certifications, Penetration testing, SIEM tools"
            },
            {
                "title": "Mobile App Development Intern",
                "location": "Los Angeles, CA",
                "stipend": 2600.0,
                "description": "Develop iOS and Android applications. Work with Swift, Kotlin, and React Native.",
                "min_qualifications": "Mobile development interest, Programming skills, CS degree pursuit",
                "expected_qualifications": "iOS or Android development, React Native, Published apps"
            },
        ]
        
        created_internships = []
        for i, template in enumerate(internship_templates):
            # Assign to different companies and HR users
            company = created_companies[i % len(created_companies)]
            hr_user = created_hr[i % len(created_hr)]
            
            # Create deadline 30-90 days from now
            days_until_deadline = random.randint(30, 90)
            deadline = datetime.now() + timedelta(days=days_until_deadline)
            
            internship = Internship(
                title=template["title"],
                company_id=company.id,
                location=template["location"],
                stipend=template["stipend"],
                description=template["description"],
                min_qualifications=template["min_qualifications"],
                expected_qualifications=template["expected_qualifications"],
                deadline=deadline,
                posted_by=hr_user.id
            )
            db.add(internship)
            db.flush()
            created_internships.append(internship)
            print(f"  + Created internship: {internship.title} at {company.name}")
        
        db.commit()
        
        # 4. Create Resumes for students
        print("\nCreating resumes...")
        resume_titles = [
            "Software Engineer Resume",
            "Data Science Resume",
            "Full Stack Developer Resume",
            "Computer Science Student Resume",
            "ML Engineer Resume",
        ]
        
        created_resumes = []
        for student in created_students:
            # Create 1-2 resumes per student
            num_resumes = random.randint(1, 2)
            for i in range(num_resumes):
                resume_title = random.choice(resume_titles)
                resume = Resume(
                    user_id=student.id,
                    title=f"{student.name} - {resume_title}",
                    file_path=f"resumes/student_{student.id}_resume_{i+1}.pdf"
                )
                db.add(resume)
                db.flush()
                created_resumes.append(resume)
                print(f"  + Created resume for {student.name}")
        
        db.commit()
        
        # 5. Create Applications
        print("\nCreating applications...")
        statuses = ["pending", "accepted", "rejected"]
        
        created_applications = []
        for student in created_students:
            # Each student applies to 2-5 internships
            num_applications = random.randint(2, 5)
            student_resumes = [r for r in created_resumes if r.user_id == student.id]
            
            if not student_resumes:
                continue
            
            # Select random internships to apply to
            selected_internships = random.sample(created_internships, min(num_applications, len(created_internships)))
            
            for internship in selected_internships:
                resume = random.choice(student_resumes)
                status = random.choice(statuses)
                
                # Create application date in the past
                days_ago = random.randint(1, 30)
                applied_at = datetime.now() - timedelta(days=days_ago)
                
                application = Application(
                    user_id=student.id,
                    internship_id=internship.id,
                    resume_id=resume.id,
                    cover_letter=f"I am very interested in the {internship.title} position at {internship.company.name}. I believe my skills and experience make me a great fit for this role.",
                    status=status,
                    applied_at=applied_at
                )
                db.add(application)
                db.flush()
                created_applications.append(application)
                print(f"  + {student.name} applied to {internship.title} ({status})")
        
        db.commit()
        
        # Print summary
        print("\n" + "="*60)
        print("[SUCCESS] Database seeding completed successfully!")
        print("="*60)
        print(f"\nSummary:")
        print(f"  • Students: {len(created_students)}")
        print(f"  • HR Users: {len(created_hr)}")
        print(f"  • Companies: {len(created_companies)}")
        print(f"  • Internships: {len(created_internships)}")
        print(f"  • Resumes: {len(created_resumes)}")
        print(f"  • Applications: {len(created_applications)}")
        
        print(f"\nLogin Credentials (password for all: password123):")
        print(f"\n  Student Accounts:")
        for student in created_students[:3]:
            print(f"    • {student.email}")
        
        print(f"\n  HR Accounts:")
        for hr in created_hr[:3]:
            print(f"    • {hr.email}")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n[ERROR] Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
