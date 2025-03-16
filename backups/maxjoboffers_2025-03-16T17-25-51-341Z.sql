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

