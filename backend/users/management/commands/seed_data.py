import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from skills.models import Skill
from institutes.models import TrainingInstitute
from employers.models import Employer
from learners.models import StudentProfile, StudentSkill, TrainingProgress
from jobs.models import Job, JobSkill
from courses.models import Course, CourseSkill
from assessments.models import Assessment, AssessmentQuestion, AssessmentResult
from applications.models import Application, EmploymentOutcome
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds realistic interconnected demo data for KaushalSetu AI (SIH 2026)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning database seeding for KaushalSetu AI...'))

        DEMO_PASSWORD = 'Demo@12345'

        # -------------------------------------------------------------------------
        # 1. CORE DEMO USERS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating core demo user accounts...')
        
        # Admin / Government User
        admin_user, _ = User.objects.get_or_create(
            username='admin@demo.com',
            defaults={
                'email': 'admin@demo.com',
                'first_name': 'Dr. Rajesh',
                'last_name': 'Verma (MSDE)',
                'role': 'admin',
                'phone': '+91 98110 23456',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password(DEMO_PASSWORD)
        admin_user.save()

        # Student User
        student_user, _ = User.objects.get_or_create(
            username='student@demo.com',
            defaults={
                'email': 'student@demo.com',
                'first_name': 'Aarav',
                'last_name': 'Sharma',
                'role': 'student',
                'phone': '+91 98230 45678',
            }
        )
        student_user.set_password(DEMO_PASSWORD)
        student_user.save()

        # Institute User
        institute_user, _ = User.objects.get_or_create(
            username='institute@demo.com',
            defaults={
                'email': 'institute@demo.com',
                'first_name': 'Prof. Sunita',
                'last_name': 'Kulkarni',
                'role': 'institute',
                'phone': '+91 98765 11223',
            }
        )
        institute_user.set_password(DEMO_PASSWORD)
        institute_user.save()

        # Employer User
        employer_user, _ = User.objects.get_or_create(
            username='employer@demo.com',
            defaults={
                'email': 'employer@demo.com',
                'first_name': 'Vikram',
                'last_name': 'Singhania',
                'role': 'employer',
                'phone': '+91 98901 88776',
            }
        )
        employer_user.set_password(DEMO_PASSWORD)
        employer_user.save()

        # -------------------------------------------------------------------------
        # 2. 20+ SKILLS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating standard industry skills catalog...')
        skills_data = [
            ('Python', 'Programming', 'General purpose programming language widely used in AI, data science, and backend development.', 1.8, True),
            ('SQL', 'Database', 'Standard relational database query language for data analysis and pipeline engineering.', 1.7, True),
            ('Excel', 'Data & Analytics', 'Advanced spreadsheet modeling, formulas, pivot tables, and financial analysis.', 1.2, False),
            ('Power BI', 'Data & Analytics', 'Microsoft interactive business intelligence data visualization and reporting platform.', 1.6, True),
            ('Statistics', 'Data & Analytics', 'Hypothesis testing, probability distributions, regression modeling, and statistical inference.', 1.4, False),
            ('JavaScript', 'Programming', 'High-level script language powering modern web applications and frontend interfaces.', 1.7, True),
            ('HTML/CSS', 'Web Development', 'Foundational semantic markup and cascade styling sheets for responsive web apps.', 1.3, False),
            ('React.js', 'Web Development', 'Modern component-based user interface library developed by Meta.', 1.8, True),
            ('Django', 'Web Development', 'High-level Python web framework encouraging clean, rapid, pragmatic development.', 1.5, True),
            ('Data Structures', 'Programming', 'Arrays, trees, graphs, sorting, searching algorithms, and complexity analysis.', 1.6, False),
            ('AI/ML', 'AI & Machine Learning', 'Supervised/unsupervised algorithms, deep neural networks, and model deployment.', 1.9, True),
            ('Cloud Computing', 'Cloud & DevOps', 'Virtualization, serverless architectures, storage, and networking on AWS/GCP/Azure.', 1.8, True),
            ('Docker', 'Cloud & DevOps', 'Containerization platform for isolated application packaging and execution.', 1.5, True),
            ('Kubernetes', 'Cloud & DevOps', 'Automated container deployment, scaling, and orchestration framework.', 1.6, True),
            ('Git', 'Cloud & DevOps', 'Distributed version control system for collaborative software engineering.', 1.4, False),
            ('Cyber Security', 'Cyber Security', 'Network threat defense, encryption protocols, penetration testing, and security posture.', 1.7, True),
            ('Problem Solving', 'Soft Skills', 'Analytical reasoning, algorithmic thinking, and structural decision making.', 1.4, False),
            ('Communication', 'Soft Skills', 'Professional verbal articulation, technical presentation, and stakeholder documentation.', 1.3, False),
            ('Tableau', 'Data & Analytics', 'Visual enterprise analytics platform for actionable interactive dashboards.', 1.4, False),
            ('Linux / Bash', 'Cloud & DevOps', 'Operating system administration, shell scripting, and server maintenance.', 1.4, False),
            ('Java', 'Programming', 'Robust object-oriented programming language for enterprise distributed architectures.', 1.5, False),
            ('REST APIs', 'Web Development', 'Architectural style for hypermedia systems and clean microservice integration.', 1.6, True),
        ]

        skills_dict = {}
        for name, cat, desc, weight, trending in skills_data:
            sk, _ = Skill.objects.get_or_create(
                name=name,
                defaults={
                    'category': cat,
                    'description': desc,
                    'market_demand_weight': weight,
                    'is_trending': trending
                }
            )
            skills_dict[name] = sk

        # -------------------------------------------------------------------------
        # 3. 5+ TRAINING INSTITUTES
        # -------------------------------------------------------------------------
        self.stdout.write('Creating accredited training institutes...')
        institutes_info = [
            (institute_user, 'Maharashtra Skill Development Center', 'MSDC-PUN-01', 'Prof. Sunita Kulkarni', 'director@msdc.gov.in', '+91 20 2567 8901', 'Shivaji Nagar, Pune', 'Pune', 'Maharashtra', 'NSDC Gold Partner'),
            (None, 'National Institute of Electronics & IT (NIELIT)', 'NIELIT-MUM-02', 'Dr. Ramesh Nair', 'info@nielit.gov.in', '+91 22 2432 1098', 'Dadar West, Mumbai', 'Mumbai', 'Maharashtra', 'MeitY Approved Center of Excellence'),
            (None, 'Karnataka State Skilling Academy', 'KSSA-BLR-03', 'Ananya Hegde', 'contact@kssa.karnataka.gov.in', '+91 80 2234 5678', 'Indiranagar, Bengaluru', 'Bengaluru', 'Karnataka', 'State Skilling Mission Accredited'),
            (None, 'Telangana Academy for Skill and Knowledge (TASK)', 'TASK-HYD-04', 'K. V. Rao', 'outreach@task.telangana.gov.in', '+91 40 2311 4455', 'Begumpet, Hyderabad', 'Hyderabad', 'Telangana', 'State Government Initiative'),
            (None, 'Delhi Skill and Entrepreneurship Hub', 'DSEU-DEL-05', 'Dr. Alok Saxena', 'admissions@dseu.delhi.gov.in', '+91 11 2654 3210', 'Okhla Industrial Area, New Delhi', 'New Delhi', 'Delhi', 'AICTE & UGC Recognized'),
            (None, 'Tamil Nadu Apex Skill Development Center', 'TNASDC-CHE-06', 'M. Senthil Kumar', 'director@tnasdc.org', '+91 44 2855 6789', 'Guindy, Chennai', 'Chennai', 'Tamil Nadu', 'State Skill Council Partner')
        ]

        institutes_dict = {}
        for user_obj, iname, icode, contact, email, phone, addr, dist, state, acc in institutes_info:
            if not user_obj:
                u, _ = User.objects.get_or_create(
                    username=email,
                    defaults={'email': email, 'first_name': contact.split()[0], 'last_name': 'Institute', 'role': 'institute', 'phone': phone}
                )
                u.set_password(DEMO_PASSWORD)
                u.save()
                user_obj = u

            inst, _ = TrainingInstitute.objects.get_or_create(
                user=user_obj,
                defaults={
                    'name': iname,
                    'code': icode,
                    'contact_person': contact,
                    'email': email,
                    'phone': phone,
                    'address': addr,
                    'district': dist,
                    'state': state,
                    'accreditation': acc,
                    'is_verified': True
                }
            )
            institutes_dict[iname] = inst

        # -------------------------------------------------------------------------
        # 4. 5+ EMPLOYERS / COMPANIES
        # -------------------------------------------------------------------------
        self.stdout.write('Creating industry hiring employers...')
        employers_info = [
            (employer_user, 'Tata Consultancy Services (TCS)', 'Information Technology', 'Vikram Singhania', 'careers@tcs-demo.com', '+91 22 6778 9000', 'TCS Sahyadri Park, Hinjawadi', 'Pune', 'Maharashtra', '1000+ Employees'),
            (None, 'Infosys Digital Technologies', 'Information Technology', 'Pooja Iyer', 'talent@infosys-demo.com', '+91 80 2852 0261', 'Electronics City, Bengaluru', 'Bengaluru', 'Karnataka', '1000+ Employees'),
            (None, 'HDFC FinTech Labs', 'BFSI / FinTech', 'Gaurav Mehra', 'hr@hdfc-fintech.com', '+91 22 6652 1100', 'Bandra Kurla Complex, Mumbai', 'Mumbai', 'Maharashtra', '500-1000 Employees'),
            (None, 'Reliance Digital Ventures', 'E-Commerce & Retail', 'Ritu Mathur', 'hiring@reliance-demo.com', '+91 22 3555 5000', 'Reliance Corporate Park, Navi Mumbai', 'Mumbai', 'Maharashtra', '1000+ Employees'),
            (None, 'Apollo Health Analytics', 'Healthcare & MedTech', 'Dr. Priya Nambiar', 'careers@apollohealth.org', '+91 44 2829 0200', 'Greams Lane, Chennai', 'Chennai', 'Tamil Nadu', '200-500 Employees'),
            (None, 'Cyient Aerospace & Engineering', 'Manufacturing & Auto', 'Satish Reddy', 'jobs@cyient-demo.com', '+91 40 6764 1000', 'Financial District, Hyderabad', 'Hyderabad', 'Telangana', '500-1000 Employees')
        ]

        employers_dict = {}
        for user_obj, cname, ind, contact, email, phone, addr, dist, state, size in employers_info:
            if not user_obj:
                u, _ = User.objects.get_or_create(
                    username=email,
                    defaults={'email': email, 'first_name': contact.split()[0], 'last_name': 'HR', 'role': 'employer', 'phone': phone}
                )
                u.set_password(DEMO_PASSWORD)
                u.save()
                user_obj = u

            emp, _ = Employer.objects.get_or_create(
                user=user_obj,
                defaults={
                    'company_name': cname,
                    'industry': ind,
                    'contact_person': contact,
                    'email': email,
                    'phone': phone,
                    'address': addr,
                    'district': dist,
                    'state': state,
                    'company_size': size,
                    'is_verified': True
                }
            )
            employers_dict[cname] = emp

        # -------------------------------------------------------------------------
        # 5. 10+ COURSES
        # -------------------------------------------------------------------------
        self.stdout.write('Creating vocational upskilling courses...')
        first_inst = list(institutes_dict.values())[0]
        second_inst = list(institutes_dict.values())[1]

        courses_data = [
            ('Power BI for Data Analytics & Executive Dashboards', 'Microsoft & NSDC', 'Data & Analytics', 6, 'Beginner', 0, 'Master interactive dashboard building, DAX measures, automated ETL pipelines, and executive reporting in Power BI.', [('Power BI', 80), ('SQL', 65), ('Excel', 75)]),
            ('Advanced SQL & Data Warehouse Optimization', 'CDAC Pune', 'Database', 8, 'Intermediate', 0, 'Deep dive into complex joins, indexing, execution plan analysis, window functions, and schema normalization.', [('SQL', 85), ('Database', 80)]),
            ('Applied Python for Data Science and Machine Learning', 'NIELIT Mumbai', 'AI & Machine Learning', 12, 'Intermediate', 0, 'Comprehensive hands-on training on NumPy, Pandas, Scikit-learn, exploratory data analysis, and predictive modeling.', [('Python', 85), ('AI/ML', 75), ('Statistics', 70)]),
            ('Full Stack Web Development with React and Django', 'Maharashtra Skill Dev Center', 'Web Development', 14, 'Intermediate', 0, 'End-to-end full-stack web engineering building enterprise REST APIs with Django and dynamic reactive frontends with React.', [('JavaScript', 80), ('React.js', 85), ('Django', 80), ('HTML/CSS', 85)]),
            ('Statistical Foundations for Business Intelligence', 'KSSA Bengaluru', 'Data & Analytics', 6, 'Beginner', 0, 'Learn probability theories, hypothesis testing, regression analysis, and variance models tailored for business analysts.', [('Statistics', 80), ('Excel', 75)]),
            ('Cloud Infrastructure & DevOps Fundamentals (AWS/GCP)', 'TASK Hyderabad', 'Cloud & DevOps', 10, 'Intermediate', 0, 'Practical training in cloud resource provisioning, containerization with Docker, and CI/CD deployment pipelines.', [('Cloud Computing', 80), ('Docker', 75), ('Linux / Bash', 70)]),
            ('Enterprise Cybersecurity & Threat Assessment', 'Delhi Skill Hub', 'Cyber Security', 10, 'Intermediate', 0, 'Understand threat vectors, perimeter defenses, vulnerability auditing, compliance guidelines, and cryptographic basics.', [('Cyber Security', 85), ('Problem Solving', 75)]),
            ('Modern JavaScript & Frontend State Architecture', 'TNASDC Chennai', 'Web Development', 8, 'Beginner', 0, 'From ES6+ syntax to modern asynchronous handling, DOM optimization, React components, and responsive design systems.', [('JavaScript', 85), ('React.js', 75), ('HTML/CSS', 85)]),
            ('Aptitude, Logical Problem Solving & Corporate Readiness', 'MSDC Pune', 'Soft Skills', 4, 'Beginner', 0, 'Hone mathematical aptitude, reasoning problem-solving frameworks, resume presentation, and technical interview simulations.', [('Problem Solving', 85), ('Communication', 80)]),
            ('Practical Docker & Kubernetes for Production Deployments', 'TASK Hyderabad', 'Cloud & DevOps', 8, 'Advanced', 0, 'Multi-stage container builds, microservice orchestration, ingress controllers, persistent volumes, and cluster monitoring.', [('Docker', 85), ('Kubernetes', 80), ('Cloud Computing', 75)])
        ]

        courses_dict = {}
        for title, prov, cat, dur, lvl, price, desc, skill_mappings in courses_data:
            c, _ = Course.objects.get_or_create(
                title=title,
                defaults={
                    'institute': first_inst if 'Pune' in prov or 'MSDC' in prov else second_inst,
                    'provider': prov,
                    'category': cat,
                    'duration_weeks': dur,
                    'level': lvl,
                    'price': price,
                    'description': desc,
                    'certificate_provided': True,
                    'course_url': 'https://swayam.gov.in'
                }
            )
            for sname, t_prof in skill_mappings:
                sk = skills_dict.get(sname)
                if sk:
                    CourseSkill.objects.get_or_create(course=c, skill=sk, defaults={'target_proficiency': t_prof})
            courses_dict[title] = c

        # -------------------------------------------------------------------------
        # 6. 10+ JOBS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating industry jobs with weighted skill requirements...')
        tcs = employers_dict['Tata Consultancy Services (TCS)']
        infosys = employers_dict['Infosys Digital Technologies']
        hdfc = employers_dict['HDFC FinTech Labs']
        reliance = employers_dict['Reliance Digital Ventures']
        apollo = employers_dict['Apollo Health Analytics']
        cyient = employers_dict['Cyient Aerospace & Engineering']

        jobs_data = [
            (tcs, 'Junior Data Analyst', 'Analyze business metrics, generate automated MIS reports, and build executive Power BI dashboards for global banking clients.', 'Pune', 'Pune', 'Maharashtra', 550000, 850000, 0, 2, 'Full-time', 8, [('Python', 75, True, 1.2), ('SQL', 75, True, 1.3), ('Excel', 70, False, 1.0), ('Power BI', 65, True, 1.2), ('Statistics', 60, False, 1.0)]),
            (infosys, 'Associate Software Engineer (Full Stack)', 'Develop full-stack web applications, microservices, and interactive responsive portals using modern JavaScript and Python.', 'Bengaluru', 'Bengaluru', 'Karnataka', 600000, 950000, 0, 2, 'Full-time', 12, [('JavaScript', 80, True, 1.3), ('Python', 75, True, 1.2), ('HTML/CSS', 80, True, 1.0), ('SQL', 70, True, 1.0), ('Data Structures', 70, True, 1.2)]),
            (hdfc, 'BI & Financial Reporting Specialist', 'Transform raw transactional data into actionable executive insights. Requires strong SQL query optimization and Power BI visualization.', 'Mumbai', 'Mumbai', 'Maharashtra', 650000, 1000000, 1, 3, 'Full-time', 5, [('Power BI', 80, True, 1.4), ('SQL', 80, True, 1.3), ('Excel', 80, True, 1.1), ('Statistics', 70, False, 1.0)]),
            (reliance, 'Junior Python Backend Developer', 'Build scalable RESTful microservices, integrate database caches, and write clean, tested backend modules for retail supply platforms.', 'Mumbai', 'Mumbai', 'Maharashtra', 500000, 800000, 0, 2, 'Full-time', 6, [('Python', 80, True, 1.4), ('Django', 75, True, 1.2), ('SQL', 70, True, 1.1), ('REST APIs', 75, True, 1.2), ('Git', 65, False, 0.9)]),
            (apollo, 'Healthcare Data Analyst', 'Cleanse patient health metrics, conduct epidemiological data visualization, and generate statistical compliance insights.', 'Chennai', 'Chennai', 'Tamil Nadu', 500000, 750000, 0, 2, 'Full-time', 4, [('Python', 70, True, 1.2), ('Statistics', 75, True, 1.3), ('Excel', 75, True, 1.0), ('SQL', 65, False, 1.0)]),
            (cyient, 'Cloud & DevOps Trainee Engineer', 'Support cloud architecture teams with Docker orchestration, automated build testing, and cloud server provisioning.', 'Hyderabad', 'Hyderabad', 'Telangana', 450000, 700000, 0, 1, 'Full-time', 10, [('Cloud Computing', 75, True, 1.4), ('Docker', 70, True, 1.2), ('Linux / Bash', 70, True, 1.1), ('Python', 60, False, 1.0)]),
            (tcs, 'Machine Learning Associate', 'Assist senior researchers in training supervised models, cleaning tabular data, and benchmarking algorithmic performance.', 'Pune', 'Pune', 'Maharashtra', 700000, 1100000, 1, 3, 'Full-time', 4, [('Python', 85, True, 1.4), ('AI/ML', 80, True, 1.5), ('Statistics', 75, True, 1.2), ('SQL', 70, False, 1.0)]),
            (infosys, 'Junior React Frontend Developer', 'Construct responsive interfaces, design accessible components, and connect to backend GraphQL/REST endpoints.', 'Bengaluru', 'Bengaluru', 'Karnataka', 520000, 820000, 0, 2, 'Full-time', 7, [('JavaScript', 80, True, 1.3), ('React.js', 80, True, 1.4), ('HTML/CSS', 85, True, 1.1), ('Git', 65, False, 0.9)]),
            (hdfc, 'Cybersecurity Operations Trainee', 'Monitor Security Operations Center (SOC) telemetry, identify intrusion indicators, and enforce security policies.', 'Mumbai', 'Mumbai', 'Maharashtra', 550000, 850000, 0, 2, 'Full-time', 4, [('Cyber Security', 80, True, 1.5), ('Cloud Computing', 70, False, 1.1), ('Problem Solving', 75, True, 1.2)]),
            (reliance, 'E-Commerce Database Administrator Trainee', 'Maintain high availability for product catalog databases, monitor replication lag, and optimize read queries.', 'Mumbai', 'Mumbai', 'Maharashtra', 480000, 720000, 0, 2, 'Full-time', 5, [('SQL', 80, True, 1.4), ('Linux / Bash', 70, True, 1.1), ('Problem Solving', 70, False, 1.0)])
        ]

        jobs_dict = {}
        for emp, title, desc, loc, dist, state, smin, smax, exp_min, exp_max, jtype, vac, req_skills in jobs_data:
            j, _ = Job.objects.get_or_create(
                employer=emp,
                title=title,
                defaults={
                    'description': desc,
                    'location': f"{loc}, {state}",
                    'district': dist,
                    'state': state,
                    'salary_min': smin,
                    'salary_max': smax,
                    'experience_min': exp_min,
                    'experience_max': exp_max,
                    'job_type': jtype,
                    'vacancies': vac,
                    'is_active': True
                }
            )
            for sname, rprof, mand, weight in req_skills:
                sk = skills_dict.get(sname)
                if sk:
                    JobSkill.objects.get_or_create(job=j, skill=sk, defaults={'required_proficiency': rprof, 'is_mandatory': mand, 'weight': weight})
            jobs_dict[title] = j

        # -------------------------------------------------------------------------
        # 7. 10+ STUDENTS / LEARNERS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating learner cohort with diverse realistic skill baselines...')
        learners_data = [
            (student_user, 'Aarav Sharma', 'B.Tech in Computer Science', 'Government College of Engineering, Pune', 'Pune', 'Maharashtra', 'Junior Data Analyst', 'Seeking Opportunities', [('Python', 70), ('SQL', 55), ('Excel', 80), ('Power BI', 30), ('Statistics', 50), ('HTML/CSS', 65)]),
            (None, 'Sneha Patil', 'B.Sc in Statistics & Mathematics', 'Fergusson College, Pune', 'Pune', 'Maharashtra', 'Junior Data Analyst', 'Seeking Opportunities', [('Statistics', 85), ('Excel', 80), ('SQL', 65), ('Python', 60), ('Power BI', 40)]),
            (None, 'Rahul Deshmukh', 'B.Tech in Information Technology', 'Veermata Jijabai Technological Institute (VJTI)', 'Mumbai', 'Maharashtra', 'Full Stack Developer', 'Employed / Placed', [('JavaScript', 85), ('Python', 80), ('HTML/CSS', 90), ('SQL', 75), ('Data Structures', 75), ('React.js', 80)]),
            (None, 'Priya Kulkarni', 'Diploma in Computer Engineering', 'Government Polytechnic, Pune', 'Pune', 'Maharashtra', 'Junior Data Analyst', 'In Training', [('Excel', 75), ('Python', 50), ('SQL', 45), ('Power BI', 25)]),
            (None, 'Amit Kumar Verma', 'B.Tech in Computer Engineering', 'IIT Delhi Alumni / DSEU Partner', 'New Delhi', 'Delhi', 'AI & Machine Learning Engineer', 'Seeking Opportunities', [('Python', 88), ('AI/ML', 78), ('Statistics', 72), ('Data Structures', 70), ('SQL', 65)]),
            (None, 'Ananya Reddy', 'B.Tech in Electronics & Communication', 'JNTU Hyderabad', 'Hyderabad', 'Telangana', 'Cloud & DevOps Engineer', 'Employed / Placed', [('Cloud Computing', 82), ('Docker', 78), ('Linux / Bash', 75), ('Python', 65), ('Problem Solving', 80)]),
            (None, 'Rohan Mehta', 'B.Com with Computer Applications', 'Symbiosis College, Pune', 'Pune', 'Maharashtra', 'Junior Data Analyst', 'Seeking Opportunities', [('Excel', 85), ('SQL', 60), ('Power BI', 35), ('Communication', 80)]),
            (None, 'Kavita Nair', 'B.Tech in Information Science', 'RV College of Engineering, Bengaluru', 'Bengaluru', 'Karnataka', 'Full Stack Developer', 'Seeking Opportunities', [('JavaScript', 82), ('HTML/CSS', 85), ('Python', 70), ('Django', 65), ('SQL', 60)]),
            (None, 'Aditya Joshi', 'B.Sc in Computer Science', 'Modern College, Pune', 'Pune', 'Maharashtra', 'Cyber Security Analyst', 'In Training', [('Cyber Security', 65), ('Cloud Computing', 55), ('Problem Solving', 70), ('Python', 50)]),
            (None, 'Meera Sundaram', 'B.Tech in Information Technology', 'Anna University, Chennai', 'Chennai', 'Tamil Nadu', 'Junior Data Analyst', 'Employed / Placed', [('Python', 78), ('SQL', 75), ('Statistics', 75), ('Excel', 80), ('Power BI', 70)])
        ]

        student_profiles = []
        for u_obj, name, edu, college, dist, state, trole, emp_stat, skill_list in learners_data:
            if not u_obj:
                email = f"{name.lower().replace(' ', '.')}@example.com"
                u, _ = User.objects.get_or_create(
                    username=email,
                    defaults={'email': email, 'first_name': name.split()[0], 'last_name': name.split()[1] if len(name.split()) > 1 else '', 'role': 'student', 'phone': '+91 98' + str(10000000 + len(student_profiles))}
                )
                u.set_password(DEMO_PASSWORD)
                u.save()
                u_obj = u

            sp, _ = StudentProfile.objects.get_or_create(
                user=u_obj,
                defaults={
                    'full_name': name,
                    'phone': u_obj.phone or '+91 98230 45678',
                    'education': edu,
                    'college_institute': college,
                    'location': f"{dist}, {state}",
                    'district': dist,
                    'state': state,
                    'target_role': trole,
                    'employment_status': emp_stat,
                    'career_interests': f"{trole}, Technology Solutions, Data Science"
                }
            )

            # Assign skills
            for sname, prof in skill_list:
                sk = skills_dict.get(sname)
                if sk:
                    StudentSkill.objects.get_or_create(
                        student=sp,
                        skill=sk,
                        defaults={
                            'proficiency_percentage': prof,
                            'assessment_score': prof,
                            'verified': prof >= 65
                        }
                    )

            student_profiles.append(sp)

        # -------------------------------------------------------------------------
        # 8. REALISTIC ASSESSMENTS & QUESTIONS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating interactive assessment modules with MCQs...')
        python_skill = skills_dict['Python']
        sql_skill = skills_dict['SQL']
        powerbi_skill = skills_dict['Power BI']
        js_skill = skills_dict['JavaScript']

        # Assessment 1: Python
        py_assessment, _ = Assessment.objects.get_or_create(
            title='Python Programming & Data Analytics Readiness',
            defaults={
                'category': 'Python',
                'skill': python_skill,
                'duration_minutes': 15,
                'total_questions': 5,
                'passing_score': 60,
                'description': 'Tests core syntax, list comprehensions, dictionary operations, pandas handling, and exception logic.'
            }
        )
        py_questions = [
            ("What is the time complexity of looking up a key in a standard Python dictionary on average?", "O(1)", "O(n)", "O(log n)", "O(n^2)", "A", "Python dictionaries are implemented as hash tables, yielding O(1) average lookup time.", "Data Structures"),
            ("Which statement accurately describes a generator function in Python?", "It returns all values into memory at once.", "It uses the 'yield' keyword to produce values lazily on demand.", "It cannot be iterated over.", "It converts code to C machine instructions.", "B", "Generators produce items one at a time using 'yield', minimizing memory consumption.", "Core Python"),
            ("What does the expression `[x**2 for x in range(5) if x % 2 == 0]` evaluate to?", "[0, 4, 16]", "[1, 9, 25]", "[0, 1, 4, 9, 16]", "[4, 16]", "A", "Even numbers from 0 to 4 are 0, 2, 4. Their squares are 0, 4, 16.", "List Comprehension"),
            ("In Pandas, how do you handle missing values by replacing them with the column mean?", "df.dropna()", "df.fillna(df.mean())", "df.replace_null()", "df.interpolate(method='zero')", "B", "fillna() takes the column mean to impute missing observations.", "Data Analytics"),
            ("What happens if a mutable object (like a list) is used as a default argument in a Python function?", "It throws a SyntaxError immediately.", "A new empty list is created every time the function runs.", "The default list is created once at definition and shared across invocations.", "Python converts it to a tuple.", "C", "Default arguments are evaluated once at definition time, leading to shared state.", "Advanced Syntax")
        ]
        for qtext, oa, ob, oc, od, ans, exp, sskill in py_questions:
            AssessmentQuestion.objects.get_or_create(
                assessment=py_assessment,
                question_text=qtext,
                defaults={'option_a': oa, 'option_b': ob, 'option_c': oc, 'option_d': od, 'correct_option': ans, 'explanation': exp, 'sub_skill': sskill, 'difficulty': 'Medium'}
            )

        # Assessment 2: SQL
        sql_assessment, _ = Assessment.objects.get_or_create(
            title='SQL & Relational Database Optimization Assessment',
            defaults={
                'category': 'SQL',
                'skill': sql_skill,
                'duration_minutes': 15,
                'total_questions': 5,
                'passing_score': 65,
                'description': 'Evaluates complex JOINs, GROUP BY aggregations, subqueries, and window functions.'
            }
        )
        sql_questions = [
            ("Which JOIN returns all rows from the left table, and matching records from the right table?", "INNER JOIN", "FULL OUTER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "C", "LEFT OUTER JOIN guarantees that every row from the left table is included in output.", "Joins"),
            ("What is the primary difference between WHERE and HAVING in SQL?", "WHERE filters rows before aggregation; HAVING filters after GROUP BY aggregation.", "HAVING filters before aggregation; WHERE filters after.", "They are 100% interchangeable.", "HAVING can only be used on string columns.", "A", "WHERE filters individual rows; HAVING filters grouped aggregate calculations.", "Aggregations"),
            ("Which window function assigns sequential integers without duplicate ranks?", "RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE()", "C", "ROW_NUMBER() assigns a unique consecutive integer to each row in the window partition.", "Window Functions"),
            ("What index type is typically created by default on a primary key column in relational databases?", "B-Tree Index", "Hash Index", "Bitmap Index", "Spatial Index", "A", "Standard databases create balanced B-Tree indexes for primary keys to facilitate fast lookups and range scans.", "Database Optimization"),
            ("What is the result of `COUNT(*)` vs `COUNT(column_name)` when rows contain NULL values?", "Both ignore NULL values completely.", "COUNT(*) counts all rows; COUNT(column_name) ignores NULL entries.", "COUNT(column_name) throws an exception if NULL exists.", "There is zero difference in result.", "B", "COUNT(*) tallies the row count irrespective of nullability; column count skips NULL.", "Aggregations")
        ]
        for qtext, oa, ob, oc, od, ans, exp, sskill in sql_questions:
            AssessmentQuestion.objects.get_or_create(
                assessment=sql_assessment,
                question_text=qtext,
                defaults={'option_a': oa, 'option_b': ob, 'option_c': oc, 'option_d': od, 'correct_option': ans, 'explanation': exp, 'sub_skill': sskill, 'difficulty': 'Medium'}
            )

        # Assessment 3: Power BI
        pbi_assessment, _ = Assessment.objects.get_or_create(
            title='Power BI & Business Intelligence Competency Test',
            defaults={
                'category': 'Power BI',
                'skill': powerbi_skill,
                'duration_minutes': 15,
                'total_questions': 4,
                'passing_score': 60,
                'description': 'Measures data modeling, Star Schema concepts, and DAX expression proficiency.'
            }
        )
        pbi_questions = [
            ("In Power BI, what is the best practice schema design for analytical performance?", "Snowflake Schema with many normalizations", "Star Schema with central Fact table and surrounding Dimension tables", "Single flat denormalized mega-table", "Circular relationship schema", "B", "Star Schemas offer optimal tabular engine compression and rapid relationship traversal.", "Data Modeling"),
            ("Which DAX function calculates a measure under a modified filter context?", "LOOKUPVALUE()", "CALCULATE()", "FILTER()", "SUMX()", "B", "CALCULATE is the foundational DAX formula that modifies and transitions filter context.", "DAX Expressions"),
            ("What tool within Power BI Desktop is used to perform data ingestion, cleansing, and reshaping?", "Power Automate", "Power Pivot", "Power Query (M Engine)", "DAX Studio", "C", "Power Query executes ETL transformations using the functional M language.", "ETL Processing"),
            ("What is the primary difference between a Calculated Column and a Measure in Power BI?", "Columns are evaluated at row level during refresh; Measures are calculated dynamically at query time based on user filters.", "Columns use DAX, Measures use SQL.", "Measures consume RAM permanently on disk.", "There is no functional distinction.", "A", "Calculated columns store static values per row taking memory; measures calculate dynamically based on visual filters.", "DAX Fundamentals")
        ]
        for qtext, oa, ob, oc, od, ans, exp, sskill in pbi_questions:
            AssessmentQuestion.objects.get_or_create(
                assessment=pbi_assessment,
                question_text=qtext,
                defaults={'option_a': oa, 'option_b': ob, 'option_c': oc, 'option_d': od, 'correct_option': ans, 'explanation': exp, 'sub_skill': sskill, 'difficulty': 'Medium'}
            )

        # Record assessment results for our main demo student
        main_student = student_profiles[0]
        AssessmentResult.objects.get_or_create(
            student=main_student,
            assessment=py_assessment,
            defaults={
                'score_percentage': 78,
                'total_questions': 5,
                'correct_answers': 4,
                'strong_skills': ['Core Python', 'List Comprehension', 'Data Analytics'],
                'moderate_skills': ['Python'],
                'weak_skills': ['Advanced Syntax'],
                'answers_record': {'1': 'A', '2': 'B', '3': 'A', '4': 'B', '5': 'A'}
            }
        )
        AssessmentResult.objects.get_or_create(
            student=main_student,
            assessment=sql_assessment,
            defaults={
                'score_percentage': 55,
                'total_questions': 5,
                'correct_answers': 3,
                'strong_skills': ['Joins', 'Aggregations'],
                'moderate_skills': ['SQL'],
                'weak_skills': ['Window Functions', 'Database Optimization'],
                'answers_record': {'1': 'C', '2': 'A', '3': 'B', '4': 'C', '5': 'B'}
            }
        )

        # -------------------------------------------------------------------------
        # 9. TRAINING PROGRESS RECORDS
        # -------------------------------------------------------------------------
        self.stdout.write('Recording learner training progressions & pre/post scores...')
        course_pbi = courses_dict['Power BI for Data Analytics & Executive Dashboards']
        course_py = courses_dict['Applied Python for Data Science and Machine Learning']
        course_sql = courses_dict['Advanced SQL & Data Warehouse Optimization']

        # Main student training progress
        TrainingProgress.objects.get_or_create(
            student=main_student,
            course=course_pbi,
            defaults={
                'institute': first_inst,
                'status': 'In Progress',
                'completion_percentage': 60,
                'pre_assessment_score': 30,
                'post_assessment_score': 65
            }
        )
        TrainingProgress.objects.get_or_create(
            student=main_student,
            course=course_py,
            defaults={
                'institute': first_inst,
                'status': 'Completed',
                'completion_percentage': 100,
                'pre_assessment_score': 45,
                'post_assessment_score': 78,
                'completed_date': timezone.now().date() - datetime.timedelta(days=30)
            }
        )

        # Additional students training
        for i, s in enumerate(student_profiles[1:6]):
            TrainingProgress.objects.get_or_create(
                student=s,
                course=course_sql if i % 2 == 0 else course_py,
                defaults={
                    'institute': first_inst if i % 2 == 0 else second_inst,
                    'status': 'Completed' if i > 2 else 'In Progress',
                    'completion_percentage': 100 if i > 2 else 55,
                    'pre_assessment_score': 40 + (i * 3),
                    'post_assessment_score': 75 + (i * 4),
                    'completed_date': timezone.now().date() - datetime.timedelta(days=15 * (i + 1)) if i > 2 else None
                }
            )

        # -------------------------------------------------------------------------
        # 10. REAL APPLICATIONS & LIFECYCLES
        # -------------------------------------------------------------------------
        self.stdout.write('Creating job applications across different stages...')
        tcs_analyst_job = jobs_dict['Junior Data Analyst']
        hdfc_bi_job = jobs_dict['BI & Financial Reporting Specialist']
        reliance_py_job = jobs_dict['Junior Python Backend Developer']
        infosys_fullstack_job = jobs_dict['Associate Software Engineer (Full Stack)']

        # Main student's applications
        Application.objects.get_or_create(
            student=main_student,
            job=tcs_analyst_job,
            defaults={
                'status': 'Shortlisted',
                'match_score': 82.5,
                'remarks': 'Profile shortlisted for technical screening round. Impressive Python & SQL benchmark scores.'
            }
        )
        Application.objects.get_or_create(
            student=main_student,
            job=hdfc_bi_job,
            defaults={
                'status': 'Interview',
                'match_score': 71.0,
                'remarks': 'Technical interview scheduled with Lead Financial Data Engineer on Oct 12.'
            }
        )
        Application.objects.get_or_create(
            student=main_student,
            job=reliance_py_job,
            defaults={
                'status': 'Applied',
                'match_score': 78.0,
                'remarks': 'Application received via KaushalSetu AI platform matching.'
            }
        )

        # Additional student applications for other employers
        Application.objects.get_or_create(
            student=student_profiles[2],  # Rahul Deshmukh
            job=infosys_fullstack_job,
            defaults={'status': 'Selected', 'match_score': 94.0, 'remarks': 'Candidate accepted offer letter.'}
        )
        Application.objects.get_or_create(
            student=student_profiles[1],  # Sneha Patil
            job=tcs_analyst_job,
            defaults={'status': 'Shortlisted', 'match_score': 88.0, 'remarks': 'Strong statistics credentials.'}
        )
        Application.objects.get_or_create(
            student=student_profiles[5],  # Ananya Reddy
            job=jobs_dict['Cloud & DevOps Trainee Engineer'],
            defaults={'status': 'Selected', 'match_score': 91.5, 'remarks': 'Successfully placed through campus drive.'}
        )

        # -------------------------------------------------------------------------
        # 11. EMPLOYMENT OUTCOMES (PLACEMENTS)
        # -------------------------------------------------------------------------
        self.stdout.write('Recording verified employment outcomes & salaries...')
        EmploymentOutcome.objects.get_or_create(
            student=student_profiles[2],
            employer=infosys,
            defaults={
                'job': infosys_fullstack_job,
                'job_title': 'Associate Software Engineer',
                'company_name': infosys.company_name,
                'salary_lpa': 7.5,
                'placement_date': timezone.now().date() - datetime.timedelta(days=45),
                'placement_type': 'Government Skilling Drive',
                'verified_by_institute': True,
                'verified_by_government': True
            }
        )
        EmploymentOutcome.objects.get_or_create(
            student=student_profiles[5],
            employer=cyient,
            defaults={
                'job': jobs_dict['Cloud & DevOps Trainee Engineer'],
                'job_title': 'Cloud DevOps Trainee Engineer',
                'company_name': cyient.company_name,
                'salary_lpa': 6.2,
                'placement_date': timezone.now().date() - datetime.timedelta(days=20),
                'placement_type': 'Campus Placement',
                'verified_by_institute': True,
                'verified_by_government': True
            }
        )
        EmploymentOutcome.objects.get_or_create(
            student=student_profiles[9],
            employer=tcs,
            defaults={
                'job': tcs_analyst_job,
                'job_title': 'Junior Data Analyst',
                'company_name': tcs.company_name,
                'salary_lpa': 6.8,
                'placement_date': timezone.now().date() - datetime.timedelta(days=10),
                'placement_type': 'Direct Industry Hire',
                'verified_by_institute': True,
                'verified_by_government': True
            }
        )

        # -------------------------------------------------------------------------
        # 12. NOTIFICATIONS
        # -------------------------------------------------------------------------
        self.stdout.write('Creating realistic system notifications...')
        Notification.objects.get_or_create(
            user=student_user,
            title='Application Status: Shortlisted',
            defaults={
                'message': 'Congratulations! Your application for Junior Data Analyst at TCS has moved to Shortlisted status.',
                'notification_type': 'application',
                'link': '/student/applications',
                'is_read': False
            }
        )
        Notification.objects.get_or_create(
            user=student_user,
            title='AI Skill Gap Detected',
            defaults={
                'message': 'Your Power BI proficiency is 30% vs 65% target for Junior Data Analyst. Check recommended upskilling course.',
                'notification_type': 'course',
                'link': '/student/skill-gap',
                'is_read': False
            }
        )
        Notification.objects.get_or_create(
            user=student_user,
            title='92% Job Match Alert',
            defaults={
                'message': 'TCS posted Junior Data Analyst opening in Pune that matches 82% of your verified skills.',
                'notification_type': 'job',
                'link': '/student/jobs',
                'is_read': True
            }
        )
        Notification.objects.get_or_create(
            user=employer_user,
            title='High-Match Candidate Applied',
            defaults={
                'message': 'Aarav Sharma applied for Junior Data Analyst with an 82% verified skill match score.',
                'notification_type': 'application',
                'link': '/employer/applications',
                'is_read': False
            }
        )

        self.stdout.write(self.style.SUCCESS('\n======================================================='))
        self.stdout.write(self.style.SUCCESS('KaushalSetu AI database seeded successfully!'))
        self.stdout.write(self.style.SUCCESS('======================================================='))
        self.stdout.write('Demo Accounts Ready:')
        self.stdout.write('  1. Student:    student@demo.com   / Demo@12345')
        self.stdout.write('  2. Institute:  institute@demo.com / Demo@12345')
        self.stdout.write('  3. Employer:   employer@demo.com  / Demo@12345')
        self.stdout.write('  4. Admin/Govt: admin@demo.com     / Demo@12345')
        self.stdout.write(self.style.SUCCESS('======================================================='))
