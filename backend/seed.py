from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
load_dotenv('.env')

from app.database import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.models.internship import Internship
from app.models.application import Application
from app.models.resume import Resume
from app.utils.hashing import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # Seed users
        # Update or create test student user
        test_student = db.query(User).filter(User.email == "test@example.com").first()
        if test_student:
            test_student.hashed_password = get_password_hash("password123")
            test_student.role = "student"
            db.commit()
            print(f"Updated test student user with ID {test_student.id}")
        else:
            test_student = User(
                name="Test Student",
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(test_student)
            db.commit()
            db.refresh(test_student)
            print(f"Created test student user with ID {test_student.id}")

        # Update or create test HR user
        test_hr = db.query(User).filter(User.email == "test-hr@example.com").first()
        if test_hr:
            test_hr.hashed_password = get_password_hash("password123")
            test_hr.role = "hr"
            db.commit()
            print(f"Updated test HR user with ID {test_hr.id}")
        else:
            test_hr = User(
                name="Test HR",
                email="test-hr@example.com",
                hashed_password=get_password_hash("password123"),
                role="hr"
            )
            db.add(test_hr)
            db.commit()
            db.refresh(test_hr)
            print(f"Created test HR user with ID {test_hr.id}")

        # Update or create test HR2 user
        test_hr2 = db.query(User).filter(User.email == "test-hr2@example.com").first()
        if test_hr2:
            test_hr2.hashed_password = get_password_hash("password123")
            test_hr2.role = "hr"
            db.commit()
            print(f"Updated test HR2 user with ID {test_hr2.id}")
        else:
            test_hr2 = User(
                name="Test HR 2",
                email="test-hr2@example.com",
                hashed_password=get_password_hash("password123"),
                role="hr"
            )
            db.add(test_hr2)
            db.commit()
            db.refresh(test_hr2)
            print(f"Created test HR2 user with ID {test_hr2.id}")

        # Update or create test student2 user
        test_student2 = db.query(User).filter(User.email == "test2@example.com").first()
        if test_student2:
            test_student2.hashed_password = get_password_hash("password123")
            test_student2.role = "student"
            db.commit()
            print(f"Updated test student2 user with ID {test_student2.id}")
        else:
            test_student2 = User(
                name="Test Student 2",
                email="test2@example.com",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(test_student2)
            db.commit()
            db.refresh(test_student2)
            print(f"Created test student2 user with ID {test_student2.id}")

        # Update or create test student3 user
        test_student3 = db.query(User).filter(User.email == "test3@example.com").first()
        if test_student3:
            test_student3.hashed_password = get_password_hash("password123")
            test_student3.role = "student"
            db.commit()
            print(f"Updated test student3 user with ID {test_student3.id}")
        else:
            test_student3 = User(
                name="Test Student 3",
                email="test3@example.com",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(test_student3)
            db.commit()
            db.refresh(test_student3)
            print(f"Created test student3 user with ID {test_student3.id}")

        # Update or create student user
        student = db.query(User).filter(User.email == "student@example.com").first()
        if student:
            student.hashed_password = get_password_hash("password")
            student.role = "student"
            db.commit()
            print(f"Updated student user with ID {student.id}")
        else:
            student = User(
                name="Student User",
                email="student@example.com",
                hashed_password=get_password_hash("password"),
                role="student"
            )
            db.add(student)
            db.commit()
            db.refresh(student)
            print(f"Created student user with ID {student.id}")

        # Update or create HR user
        hr = db.query(User).filter(User.email == "hr@example.com").first()
        if hr:
            hr.hashed_password = get_password_hash("password")
            hr.role = "hr"
            db.commit()
            print(f"Updated HR user with ID {hr.id}")
        else:
            hr = User(
                name="HR User",
                email="hr@example.com",
                hashed_password=get_password_hash("password"),
                role="hr"
            )
            db.add(hr)
            db.commit()
            db.refresh(hr)
            print(f"Created HR user with ID {hr.id}")

        # Migrate existing internships to test_hr
        existing_internships = db.query(Internship).filter(Internship.posted_by == hr.id).all()
        for internship in existing_internships:
            internship.posted_by = test_hr.id
        if existing_internships:
            db.commit()
            print(f"Updated {len(existing_internships)} internships to be posted by test_hr (ID {test_hr.id})")

        # Seed resume for test_student
        resume_test = db.query(Resume).filter(Resume.user_id == test_student.id).first()
        if not resume_test:
            resume_test = Resume(
                user_id=test_student.id,
                title="Test Resume",
                file_path="resumes/test_resume.pdf"
            )
            db.add(resume_test)
            db.commit()
            db.refresh(resume_test)
            print(f"Created test resume with ID {resume_test.id}")

        # Seed resume for student
        resume = db.query(Resume).filter(Resume.user_id == student.id).first()
        if not resume:
            resume = Resume(
                user_id=student.id,
                title="Sample Resume",
                file_path="resumes/sample_resume.pdf"
            )
            db.add(resume)
            db.commit()
            db.refresh(resume)
            print(f"Created resume with ID {resume.id}")

        # Seed resume for test_student2
        resume_test2 = db.query(Resume).filter(Resume.user_id == test_student2.id).first()
        if not resume_test2:
            resume_test2 = Resume(
                user_id=test_student2.id,
                title="Test Resume 2",
                file_path="resumes/test_resume2.pdf"
            )
            db.add(resume_test2)
            db.commit()
            db.refresh(resume_test2)
            print(f"Created test resume2 with ID {resume_test2.id}")

        # Seed resume for test_student3
        resume_test3 = db.query(Resume).filter(Resume.user_id == test_student3.id).first()
        if not resume_test3:
            resume_test3 = Resume(
                user_id=test_student3.id,
                title="Test Resume 3",
                file_path="resumes/test_resume3.pdf"
            )
            db.add(resume_test3)
            db.commit()
            db.refresh(resume_test3)
            print(f"Created test resume3 with ID {resume_test3.id}")

        # Seed companies
        company = db.query(Company).filter(Company.name == "Sample Company").first()
        if not company:
            company = Company(
                name="Sample Company"
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            print(f"Created company with ID {company.id}")

        company2 = db.query(Company).filter(Company.name == "Tech Innovations Inc.").first()
        if not company2:
            company2 = Company(
                name="Tech Innovations Inc."
            )
            db.add(company2)
            db.commit()
            db.refresh(company2)
            print(f"Created company2 with ID {company2.id}")

        company3 = db.query(Company).filter(Company.name == "Global Solutions Ltd.").first()
        if not company3:
            company3 = Company(
                name="Global Solutions Ltd."
            )
            db.add(company3)
            db.commit()
            db.refresh(company3)
            print(f"Created company3 with ID {company3.id}")

        company4 = db.query(Company).filter(Company.name == "Innovate Corp.").first()
        if not company4:
            company4 = Company(
                name="Innovate Corp."
            )
            db.add(company4)
            db.commit()
            db.refresh(company4)
            print(f"Created company4 with ID {company4.id}")

        company5 = db.query(Company).filter(Company.name == "Future Tech LLC.").first()
        if not company5:
            company5 = Company(
                name="Future Tech LLC."
            )
            db.add(company5)
            db.commit()
            db.refresh(company5)
            print(f"Created company5 with ID {company5.id}")

        # Seed internships posted by test_hr
        deadline1 = datetime.now() + timedelta(days=30)
        internship1 = db.query(Internship).filter(Internship.title == "Software Engineering Intern").first()
        if not internship1:
            internship1 = Internship(
                title="Software Engineering Intern",
                description="Work on fullstack projects",
                company_id=company.id,
                location="Remote",
                stipend=500.0,
                min_qualifications="Basic programming knowledge",
                expected_qualifications="React and Python experience",
                deadline=deadline1,
                posted_by=test_hr.id
            )
            db.add(internship1)
            db.commit()
            db.refresh(internship1)
            print(f"Created internship1 with ID {internship1.id}")

        deadline2 = datetime.now() + timedelta(days=15)
        internship2 = db.query(Internship).filter(Internship.title == "Marketing Intern").first()
        if not internship2:
            internship2 = Internship(
                title="Marketing Intern",
                description="Help with digital marketing",
                company_id=company.id,
                location="Office",
                stipend=300.0,
                min_qualifications="Basic marketing knowledge",
                expected_qualifications="Social media experience",
                deadline=deadline2,
                posted_by=test_hr.id
            )
            db.add(internship2)
            db.commit()
            db.refresh(internship2)
            print(f"Created internship2 with ID {internship2.id}")

        # More internships by test_hr
        deadline3 = datetime.now() + timedelta(days=45)
        internship3 = db.query(Internship).filter(Internship.title == "Data Analyst Intern").first()
        if not internship3:
            internship3 = Internship(
                title="Data Analyst Intern",
                description="Analyze data and create reports",
                company_id=company2.id,
                location="Hybrid",
                stipend=400.0,
                min_qualifications="Basic statistics knowledge",
                expected_qualifications="Python and SQL experience",
                deadline=deadline3,
                posted_by=test_hr.id
            )
            db.add(internship3)
            db.commit()
            db.refresh(internship3)
            print(f"Created internship3 with ID {internship3.id}")

        # Internships by test_hr2
        deadline4 = datetime.now() + timedelta(days=20)
        internship4 = db.query(Internship).filter(Internship.title == "UX/UI Design Intern").first()
        if not internship4:
            internship4 = Internship(
                title="UX/UI Design Intern",
                description="Design user interfaces",
                company_id=company3.id,
                location="Remote",
                stipend=350.0,
                min_qualifications="Basic design skills",
                expected_qualifications="Figma and Adobe XD experience",
                deadline=deadline4,
                posted_by=test_hr2.id
            )
            db.add(internship4)
            db.commit()
            db.refresh(internship4)
            print(f"Created internship4 with ID {internship4.id}")

        deadline5 = datetime.now() + timedelta(days=60)
        internship5 = db.query(Internship).filter(Internship.title == "Product Management Intern").first()
        if not internship5:
            internship5 = Internship(
                title="Product Management Intern",
                description="Assist in product development",
                company_id=company3.id,
                location="Office",
                stipend=450.0,
                min_qualifications="Basic business knowledge",
                expected_qualifications="Agile and Scrum experience",
                deadline=deadline5,
                posted_by=test_hr2.id
            )
            db.add(internship5)
            db.commit()
            db.refresh(internship5)
            print(f"Created internship5 with ID {internship5.id}")

        # Additional internships by test_hr
        deadline6 = datetime.now() + timedelta(days=25)
        internship6 = db.query(Internship).filter(Internship.title == "AI/ML Intern").first()
        if not internship6:
            internship6 = Internship(
                title="AI/ML Intern",
                description="Work on machine learning models",
                company_id=company4.id,
                location="Remote",
                stipend=550.0,
                min_qualifications="Basic ML knowledge",
                expected_qualifications="Python, TensorFlow experience",
                deadline=deadline6,
                posted_by=test_hr.id
            )
            db.add(internship6)
            db.commit()
            db.refresh(internship6)
            print(f"Created internship6 with ID {internship6.id}")

        deadline7 = datetime.now() + timedelta(days=35)
        internship7 = db.query(Internship).filter(Internship.title == "Cybersecurity Intern").first()
        if not internship7:
            internship7 = Internship(
                title="Cybersecurity Intern",
                description="Learn about network security",
                company_id=company5.id,
                location="Hybrid",
                stipend=480.0,
                min_qualifications="Basic security concepts",
                expected_qualifications="Ethical hacking skills",
                deadline=deadline7,
                posted_by=test_hr.id
            )
            db.add(internship7)
            db.commit()
            db.refresh(internship7)
            print(f"Created internship7 with ID {internship7.id}")

        # Additional internships by test_hr2
        deadline8 = datetime.now() + timedelta(days=50)
        internship8 = db.query(Internship).filter(Internship.title == "DevOps Intern").first()
        if not internship8:
            internship8 = Internship(
                title="DevOps Intern",
                description="Manage CI/CD pipelines",
                company_id=company4.id,
                location="Office",
                stipend=520.0,
                min_qualifications="Basic scripting",
                expected_qualifications="Docker, Kubernetes experience",
                deadline=deadline8,
                posted_by=test_hr2.id
            )
            db.add(internship8)
            db.commit()
            db.refresh(internship8)
            print(f"Created internship8 with ID {internship8.id}")

        deadline9 = datetime.now() + timedelta(days=40)
        internship9 = db.query(Internship).filter(Internship.title == "Blockchain Intern").first()
        if not internship9:
            internship9 = Internship(
                title="Blockchain Intern",
                description="Develop blockchain applications",
                company_id=company5.id,
                location="Remote",
                stipend=600.0,
                min_qualifications="Basic crypto knowledge",
                expected_qualifications="Solidity, Web3 experience",
                deadline=deadline9,
                posted_by=test_hr2.id
            )
            db.add(internship9)
            db.commit()
            db.refresh(internship9)
            print(f"Created internship9 with ID {internship9.id}")

        # Additional students
        test_student4 = db.query(User).filter(User.email == "test4@example.com").first()
        if not test_student4:
            test_student4 = User(
                name="Test Student 4",
                email="test4@example.com",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(test_student4)
            db.commit()
            db.refresh(test_student4)
            print(f"Created test student4 user with ID {test_student4.id}")

        test_student5 = db.query(User).filter(User.email == "test5@example.com").first()
        if not test_student5:
            test_student5 = User(
                name="Test Student 5",
                email="test5@example.com",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(test_student5)
            db.commit()
            db.refresh(test_student5)
            print(f"Created test student5 user with ID {test_student5.id}")

        # Resumes for new students
        resume_test4 = db.query(Resume).filter(Resume.user_id == test_student4.id).first()
        if not resume_test4:
            resume_test4 = Resume(
                user_id=test_student4.id,
                title="Test Resume 4",
                file_path="resumes/test_resume4.pdf"
            )
            db.add(resume_test4)
            db.commit()
            db.refresh(resume_test4)
            print(f"Created test resume4 with ID {resume_test4.id}")

        resume_test5 = db.query(Resume).filter(Resume.user_id == test_student5.id).first()
        if not resume_test5:
            resume_test5 = Resume(
                user_id=test_student5.id,
                title="Test Resume 5",
                file_path="resumes/test_resume5.pdf"
            )
            db.add(resume_test5)
            db.commit()
            db.refresh(resume_test5)
            print(f"Created test resume5 with ID {resume_test5.id}")

        # Seed applications by test_student
        application1 = db.query(Application).filter(Application.user_id == test_student.id, Application.internship_id == internship1.id).first()
        if not application1:
            application1 = Application(
                user_id=test_student.id,
                internship_id=internship1.id,
                resume_id=resume_test.id,
                status="applied"
            )
            db.add(application1)
            db.commit()
            db.refresh(application1)
            print(f"Created application1 with ID {application1.id}")

        application2 = db.query(Application).filter(Application.user_id == test_student.id, Application.internship_id == internship2.id).first()
        if not application2:
            application2 = Application(
                user_id=test_student.id,
                internship_id=internship2.id,
                resume_id=resume_test.id,
                status="interview"
            )
            db.add(application2)
            db.commit()
            db.refresh(application2)
            print(f"Created application2 with ID {application2.id}")

        # More applications by test_student
        application3 = db.query(Application).filter(Application.user_id == test_student.id, Application.internship_id == internship3.id).first()
        if not application3:
            application3 = Application(
                user_id=test_student.id,
                internship_id=internship3.id,
                resume_id=resume_test.id,
                status="applied"
            )
            db.add(application3)
            db.commit()
            db.refresh(application3)
            print(f"Created application3 with ID {application3.id}")

        # Applications by test_student2
        application4 = db.query(Application).filter(Application.user_id == test_student2.id, Application.internship_id == internship1.id).first()
        if not application4:
            application4 = Application(
                user_id=test_student2.id,
                internship_id=internship1.id,
                resume_id=resume_test2.id,
                status="applied"
            )
            db.add(application4)
            db.commit()
            db.refresh(application4)
            print(f"Created application4 with ID {application4.id}")

        application5 = db.query(Application).filter(Application.user_id == test_student2.id, Application.internship_id == internship4.id).first()
        if not application5:
            application5 = Application(
                user_id=test_student2.id,
                internship_id=internship4.id,
                resume_id=resume_test2.id,
                status="interview"
            )
            db.add(application5)
            db.commit()
            db.refresh(application5)
            print(f"Created application5 with ID {application5.id}")

        # Applications by test_student3
        application6 = db.query(Application).filter(Application.user_id == test_student3.id, Application.internship_id == internship2.id).first()
        if not application6:
            application6 = Application(
                user_id=test_student3.id,
                internship_id=internship2.id,
                resume_id=resume_test3.id,
                status="applied"
            )
            db.add(application6)
            db.commit()
            db.refresh(application6)
            print(f"Created application6 with ID {application6.id}")

        application7 = db.query(Application).filter(Application.user_id == test_student3.id, Application.internship_id == internship5.id).first()
        if not application7:
            application7 = Application(
                user_id=test_student3.id,
                internship_id=internship5.id,
                resume_id=resume_test3.id,
                status="applied"
            )
            db.add(application7)
            db.commit()
            db.refresh(application7)
            print(f"Created application7 with ID {application7.id}")

        # Applications by student
        application8 = db.query(Application).filter(Application.user_id == student.id, Application.internship_id == internship3.id).first()
        if not application8:
            application8 = Application(
                user_id=student.id,
                internship_id=internship3.id,
                resume_id=resume.id,
                status="interview"
            )
            db.add(application8)
            db.commit()
            db.refresh(application8)
            print(f"Created application8 with ID {application8.id}")

        # Additional applications for more data in HR panel and student dashboards
        # Applications by test_student4
        application9 = db.query(Application).filter(Application.user_id == test_student4.id, Application.internship_id == internship6.id).first()
        if not application9:
            application9 = Application(
                user_id=test_student4.id,
                internship_id=internship6.id,
                resume_id=resume_test4.id,
                status="applied"
            )
            db.add(application9)
            db.commit()
            db.refresh(application9)
            print(f"Created application9 with ID {application9.id}")

        application10 = db.query(Application).filter(Application.user_id == test_student4.id, Application.internship_id == internship7.id).first()
        if not application10:
            application10 = Application(
                user_id=test_student4.id,
                internship_id=internship7.id,
                resume_id=resume_test4.id,
                status="rejected"
            )
            db.add(application10)
            db.commit()
            db.refresh(application10)
            print(f"Created application10 with ID {application10.id}")

        # Applications by test_student5
        application11 = db.query(Application).filter(Application.user_id == test_student5.id, Application.internship_id == internship8.id).first()
        if not application11:
            application11 = Application(
                user_id=test_student5.id,
                internship_id=internship8.id,
                resume_id=resume_test5.id,
                status="interview"
            )
            db.add(application11)
            db.commit()
            db.refresh(application11)
            print(f"Created application11 with ID {application11.id}")

        application12 = db.query(Application).filter(Application.user_id == test_student5.id, Application.internship_id == internship9.id).first()
        if not application12:
            application12 = Application(
                user_id=test_student5.id,
                internship_id=internship9.id,
                resume_id=resume_test5.id,
                status="applied"
            )
            db.add(application12)
            db.commit()
            db.refresh(application12)
            print(f"Created application12 with ID {application12.id}")

        # Cross applications for richer data
        application13 = db.query(Application).filter(Application.user_id == test_student2.id, Application.internship_id == internship6.id).first()
        if not application13:
            application13 = Application(
                user_id=test_student2.id,
                internship_id=internship6.id,
                resume_id=resume_test2.id,
                status="applied"
            )
            db.add(application13)
            db.commit()
            db.refresh(application13)
            print(f"Created application13 with ID {application13.id}")

        application14 = db.query(Application).filter(Application.user_id == test_student3.id, Application.internship_id == internship8.id).first()
        if not application14:
            application14 = Application(
                user_id=test_student3.id,
                internship_id=internship8.id,
                resume_id=resume_test3.id,
                status="rejected"
            )
            db.add(application14)
            db.commit()
            db.refresh(application14)
            print(f"Created application14 with ID {application14.id}")

        # More applications to internship1 for HR sorting data
        application15 = db.query(Application).filter(Application.user_id == test_student4.id, Application.internship_id == internship1.id).first()
        if not application15:
            application15 = Application(
                user_id=test_student4.id,
                internship_id=internship1.id,
                resume_id=resume_test4.id,
                status="applied"
            )
            db.add(application15)
            db.commit()
            db.refresh(application15)
            print(f"Created application15 with ID {application15.id}")

        application16 = db.query(Application).filter(Application.user_id == test_student5.id, Application.internship_id == internship1.id).first()
        if not application16:
            application16 = Application(
                user_id=test_student5.id,
                internship_id=internship1.id,
                resume_id=resume_test5.id,
                status="interview"
            )
            db.add(application16)
            db.commit()
            db.refresh(application16)
            print(f"Created application16 with ID {application16.id}")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
