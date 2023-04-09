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

CREATE DATABASE db_cuidadores;
\connect db_cuidadores;

--
-- Name: caregiver_score; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.caregiver_score (
    id integer NOT NULL,
    caregiver_id integer NOT NULL,
    customer_id integer NOT NULL,
    observation character(1) NOT NULL,
    score real NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone NOT NULL
);


ALTER TABLE public.caregiver_score OWNER TO postgres;

--
-- Name: caregiver_score_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.caregiver_score_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caregiver_score_id_seq OWNER TO postgres;

--
-- Name: caregiver_score_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.caregiver_score_id_seq OWNED BY public.caregiver_score.id;


--
-- Name: contract; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract (
    id integer NOT NULL,
    status character(1) NOT NULL,
    start timestamp without time zone NOT NULL,
    "end" timestamp without time zone NOT NULL,
    customer_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone NOT NULL,
    amount real NOT NULL
);


ALTER TABLE public.contract OWNER TO postgres;

--
-- Name: contract_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contract_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contract_id_seq OWNER TO postgres;

--
-- Name: contract_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contract_id_seq OWNED BY public.contract.id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_type (
    id integer,
    caregiver_id integer,
    customer_id integer,
    observation character varying(255),
    score double precision,
    created_at date,
    modified_at date
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: caregiver_score id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caregiver_score ALTER COLUMN id SET DEFAULT nextval('public.caregiver_score_id_seq'::regclass);


--
-- Name: contract id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract ALTER COLUMN id SET DEFAULT nextval('public.contract_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: caregiver_score; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.caregiver_score (id, caregiver_id, customer_id, observation, score, created_at, modified_at) FROM stdin;
\.


--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract (id, status, start, "end", customer_id, created_at, modified_at, amount) FROM stdin;
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (id, caregiver_id, customer_id, observation, score, created_at, modified_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, description, name, last_name, password, mail, type, created_at, modified_at, enabled, hourly_rate) FROM stdin;
\.


--
-- Name: caregiver_score_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.caregiver_score_id_seq', 1, false);


--
-- Name: contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: caregiver_score caregiver_score_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caregiver_score
    ADD CONSTRAINT caregiver_score_pkey PRIMARY KEY (id);


--
-- Name: contract contract_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

