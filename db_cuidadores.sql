--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Debian 15.2-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: db_cuidadores; Owner: postgres
--

CREATE DATABASE db_cuidadores;
\connect db_cuidadores;

CREATE TABLE public.users (
    id integer NOT NULL,
    description character varying(255),
    name character varying(255),
    last_name character varying(255),
    password character varying(255),
    mail character varying(255),
    type integer,
    created_at date,
    modified_at date,
    enabled boolean,
    hourly_rate double precision
);


ALTER TABLE public.users OWNER TO postgres;

CREATE TABLE db_cuidadores.contract(
    id SERIAL PRIMARY KEY,
    status VARCHAR(255),
    customer_id INTEGER,
    amount FLOAT,
    contract_start DATE,
    contract_end DATE,
    created_at DATE,
    modified_at DATE
);

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE db_cuidadores.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE db_cuidadores.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: db_cuidadores; Owner: postgres
--

ALTER SEQUENCE db_cuidadores.users_id_seq OWNED BY db_cuidadores.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: db_cuidadores; Owner: postgres
--

ALTER TABLE ONLY db_cuidadores.users ALTER COLUMN id SET DEFAULT nextval('db_cuidadores.users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: db_cuidadores; Owner: postgres
--

COPY db_cuidadores.users (id, description, name, last_name, password, mail, type, created_at, modified_at, enabled, hourly_rate) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: db_cuidadores; Owner: postgres
--

SELECT pg_catalog.setval('db_cuidadores.users_id_seq', 1, false);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: db_cuidadores; Owner: postgres
--

ALTER TABLE ONLY db_cuidadores.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

