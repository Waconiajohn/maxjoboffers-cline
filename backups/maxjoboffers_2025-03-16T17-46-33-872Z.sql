--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app; Type: SCHEMA; Schema: -; Owner: maxjoboffers_adm
--

CREATE SCHEMA app;


ALTER SCHEMA app OWNER TO maxjoboffers_adm;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ApplicationStatusHistory; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."ApplicationStatusHistory" (
    id text NOT NULL,
    "applicationId" text NOT NULL,
    status text NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text
);


ALTER TABLE public."ApplicationStatusHistory" OWNER TO maxjoboffers_app;

--
-- Name: CoverLetter; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."CoverLetter" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "jobId" text,
    "resumeId" text,
    format text,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."CoverLetter" OWNER TO maxjoboffers_app;

--
-- Name: Interview; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."Interview" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jobApplicationId" text NOT NULL,
    date timestamp without time zone NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    interviewers text[] DEFAULT '{}'::text[],
    duration integer,
    location text,
    feedback text,
    status text DEFAULT 'scheduled'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."Interview" OWNER TO maxjoboffers_app;

--
-- Name: Job; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."Job" (
    id text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text NOT NULL,
    description text NOT NULL,
    salary text,
    url text,
    "jobType" text,
    "experienceLevel" text,
    industry text,
    skills text[] DEFAULT '{}'::text[],
    benefits text[] DEFAULT '{}'::text[],
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."Job" OWNER TO maxjoboffers_app;

--
-- Name: JobApplication; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."JobApplication" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jobId" text NOT NULL,
    "resumeId" text,
    "coverLetterId" text,
    status text NOT NULL,
    "appliedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "followUpDate" timestamp without time zone,
    notes text,
    "rejectionReason" text,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."JobApplication" OWNER TO maxjoboffers_app;

--
-- Name: LinkedInPost; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."LinkedInPost" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    hashtags text[] DEFAULT '{}'::text[],
    "suggestedImage" text,
    "engagementTips" text[] DEFAULT '{}'::text[],
    "publishDate" timestamp without time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."LinkedInPost" OWNER TO maxjoboffers_app;

--
-- Name: LinkedInProfile; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."LinkedInProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    headline text,
    summary text,
    "profileUrl" text,
    connections integer,
    recommendations jsonb,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."LinkedInProfile" OWNER TO maxjoboffers_app;

--
-- Name: NetworkingStrategy; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."NetworkingStrategy" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    "connectionStrategies" jsonb NOT NULL,
    "contentStrategy" jsonb NOT NULL,
    "outreachTemplates" jsonb NOT NULL,
    kpis jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."NetworkingStrategy" OWNER TO maxjoboffers_app;

--
-- Name: PaymentHistory; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."PaymentHistory" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    description text NOT NULL,
    "paymentMethod" text NOT NULL,
    status text NOT NULL,
    "stripePaymentId" text,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaymentHistory" OWNER TO maxjoboffers_app;

--
-- Name: Resume; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."Resume" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "matchScore" integer,
    keywords text[] DEFAULT '{}'::text[],
    "parentResumeId" text,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."Resume" OWNER TO maxjoboffers_app;

--
-- Name: SavedJob; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."SavedJob" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jobId" text NOT NULL,
    notes text,
    "savedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SavedJob" OWNER TO maxjoboffers_app;

--
-- Name: User; Type: TABLE; Schema: public; Owner: maxjoboffers_app
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    "lastLoginAt" timestamp without time zone,
    "profilePictureUrl" text,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO maxjoboffers_app;

--
-- Data for Name: ApplicationStatusHistory; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."ApplicationStatusHistory" (id, "applicationId", status, date, notes) FROM stdin;
\.


--
-- Data for Name: CoverLetter; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."CoverLetter" (id, "userId", title, content, "jobId", "resumeId", format, version, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Interview; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."Interview" (id, "userId", "jobApplicationId", date, round, interviewers, duration, location, feedback, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."Job" (id, title, company, location, description, salary, url, "jobType", "experienceLevel", industry, skills, benefits, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: JobApplication; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."JobApplication" (id, "userId", "jobId", "resumeId", "coverLetterId", status, "appliedDate", "followUpDate", notes, "rejectionReason", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LinkedInPost; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."LinkedInPost" (id, "userId", title, content, hashtags, "suggestedImage", "engagementTips", "publishDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LinkedInProfile; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."LinkedInProfile" (id, "userId", headline, summary, "profileUrl", connections, recommendations, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NetworkingStrategy; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."NetworkingStrategy" (id, "userId", title, summary, "connectionStrategies", "contentStrategy", "outreachTemplates", kpis, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PaymentHistory; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."PaymentHistory" (id, "userId", amount, currency, description, "paymentMethod", status, "stripePaymentId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Resume; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."Resume" (id, "userId", title, content, "matchScore", keywords, "parentResumeId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SavedJob; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."SavedJob" (id, "userId", "jobId", notes, "savedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: maxjoboffers_app
--

COPY public."User" (id, email, name, password, "lastLoginAt", "profilePictureUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: ApplicationStatusHistory ApplicationStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."ApplicationStatusHistory"
    ADD CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: CoverLetter CoverLetter_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."CoverLetter"
    ADD CONSTRAINT "CoverLetter_pkey" PRIMARY KEY (id);


--
-- Name: Interview Interview_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_pkey" PRIMARY KEY (id);


--
-- Name: JobApplication JobApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: LinkedInPost LinkedInPost_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."LinkedInPost"
    ADD CONSTRAINT "LinkedInPost_pkey" PRIMARY KEY (id);


--
-- Name: LinkedInProfile LinkedInProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."LinkedInProfile"
    ADD CONSTRAINT "LinkedInProfile_pkey" PRIMARY KEY (id);


--
-- Name: NetworkingStrategy NetworkingStrategy_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."NetworkingStrategy"
    ADD CONSTRAINT "NetworkingStrategy_pkey" PRIMARY KEY (id);


--
-- Name: PaymentHistory PaymentHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);


--
-- Name: Resume Resume_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Resume"
    ADD CONSTRAINT "Resume_pkey" PRIMARY KEY (id);


--
-- Name: SavedJob SavedJob_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: LinkedInProfile_userId_key; Type: INDEX; Schema: public; Owner: maxjoboffers_app
--

CREATE UNIQUE INDEX "LinkedInProfile_userId_key" ON public."LinkedInProfile" USING btree ("userId");


--
-- Name: SavedJob_userId_jobId_key; Type: INDEX; Schema: public; Owner: maxjoboffers_app
--

CREATE UNIQUE INDEX "SavedJob_userId_jobId_key" ON public."SavedJob" USING btree ("userId", "jobId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: maxjoboffers_app
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ApplicationStatusHistory ApplicationStatusHistory_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."ApplicationStatusHistory"
    ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public."JobApplication"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CoverLetter CoverLetter_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."CoverLetter"
    ADD CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CoverLetter CoverLetter_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."CoverLetter"
    ADD CONSTRAINT "CoverLetter_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public."Resume"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CoverLetter CoverLetter_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."CoverLetter"
    ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interview Interview_jobApplicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES public."JobApplication"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interview Interview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobApplication JobApplication_coverLetterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES public."CoverLetter"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JobApplication JobApplication_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobApplication JobApplication_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public."Resume"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JobApplication JobApplication_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."JobApplication"
    ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LinkedInPost LinkedInPost_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."LinkedInPost"
    ADD CONSTRAINT "LinkedInPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LinkedInProfile LinkedInProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."LinkedInProfile"
    ADD CONSTRAINT "LinkedInProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkingStrategy NetworkingStrategy_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."NetworkingStrategy"
    ADD CONSTRAINT "NetworkingStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentHistory PaymentHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Resume Resume_parentResumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Resume"
    ADD CONSTRAINT "Resume_parentResumeId_fkey" FOREIGN KEY ("parentResumeId") REFERENCES public."Resume"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Resume Resume_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."Resume"
    ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SavedJob SavedJob_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SavedJob SavedJob_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxjoboffers_app
--

ALTER TABLE ONLY public."SavedJob"
    ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA app; Type: ACL; Schema: -; Owner: maxjoboffers_adm
--

GRANT ALL ON SCHEMA app TO maxjoboffers_app;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: maxjoboffers_adm
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO maxjoboffers_adm;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app; Owner: maxjoboffers_adm
--

ALTER DEFAULT PRIVILEGES FOR ROLE maxjoboffers_adm IN SCHEMA app GRANT ALL ON SEQUENCES  TO maxjoboffers_app;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: app; Owner: maxjoboffers_adm
--

ALTER DEFAULT PRIVILEGES FOR ROLE maxjoboffers_adm IN SCHEMA app GRANT ALL ON TABLES  TO maxjoboffers_app;


--
-- PostgreSQL database dump complete
--

