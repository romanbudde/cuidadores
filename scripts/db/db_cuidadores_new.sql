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
-- Name: caregiver_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.caregiver_availability (
    id bigint NOT NULL,
    caregiver_id bigint NOT NULL,
    dates json NOT NULL
);


ALTER TABLE public.caregiver_availability OWNER TO postgres;

--
-- Name: caregiver_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.caregiver_availability_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caregiver_availability_id_seq OWNER TO postgres;

--
-- Name: caregiver_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.caregiver_availability_id_seq OWNED BY public.caregiver_availability.id;


--
-- Name: caregiver_score; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.caregiver_score (
    id integer NOT NULL,
    caregiver_id integer NOT NULL,
    customer_id integer NOT NULL,
    observation character varying(500) NOT NULL,
    score numeric NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone
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
    status character varying NOT NULL,
    date character varying NOT NULL,
    customer_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    modified_at timestamp without time zone NOT NULL,
    amount real NOT NULL,
    caregiver_id integer NOT NULL,
    horarios json NOT NULL
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
    user_type_number character varying(5) NOT NULL,
    user_type character varying(99) NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_type_id_seq OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_type_id_seq OWNED BY public.user_type.id;


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
    created_at timestamp without time zone,
    modified_at timestamp without time zone,
    enabled boolean,
    hourly_rate double precision,
    average_review_score numeric,
    address character varying
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
-- Name: caregiver_availability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caregiver_availability ALTER COLUMN id SET DEFAULT nextval('public.caregiver_availability_id_seq'::regclass);


--
-- Name: caregiver_score id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caregiver_score ALTER COLUMN id SET DEFAULT nextval('public.caregiver_score_id_seq'::regclass);


--
-- Name: contract id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract ALTER COLUMN id SET DEFAULT nextval('public.contract_id_seq'::regclass);


--
-- Name: user_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.user_type_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: caregiver_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.caregiver_availability (id, caregiver_id, dates) FROM stdin;
9	4	{"30/05/2023":["06:30","07:00","07:30"],"31/05/2023":["08:00","08:30","09:00"]}
3	48	{"14/05/2023":["04:00","04:30","05:00"],"15/05/2023":["05:00","05:30","06:00"],"16/05/2023":["06:30","07:00","07:30"],"17/05/2023":["08:00","08:30","09:00"],"02/06/2023":["02:30","03:00","07:30","08:00","08:30","09:00","09:30","10:00"],"03/06/2023":["01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00"],"09/06/2023":["02:00","02:30","03:00","03:30","04:00","04:30"],"10/06/2023":["03:00","03:30","04:00","04:30"],"11/06/2023":["02:00","03:30","04:00","04:30"],"14/06/2023":[],"15/06/2023":[],"16/06/2023":[],"17/06/2023":[],"24/06/2023":["18:00","19:00","20:00","20:30","21:00","21:30","22:00","22:30"],"25/06/2023":["22:00","22:30"],"26/06/2023":["19:30","20:00","20:30","21:00"],"27/06/2023":["19:00","19:30","20:00","21:30","22:00","22:30"],"28/06/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"29/06/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"30/06/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"30/07/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"31/07/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"01/08/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"],"02/08/2023":["19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"]}
\.


--
-- Data for Name: caregiver_score; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.caregiver_score (id, caregiver_id, customer_id, observation, score, created_at, modified_at) FROM stdin;
2	4	2	review dos	8.5	2023-04-10 12:34:56	2023-04-10 12:34:56
1	6	2	el mejor servicio de todos	9.5	2023-04-10 12:34:56	2023-04-10 12:34:56
3	30	2	review tres	7.5	2023-04-10 12:34:56	2023-04-10 12:34:56
4	48	2	review cuatro	6.5	2023-04-10 12:34:56	2023-04-10 12:34:56
6	6	2	el mejor servicio lejos	8	2023-05-11 15:25:13.574	\N
7	6	2	el mejor servicio lejos	8	2023-05-11 15:25:55.713	\N
38	6	2	el mejor servicio lejos	7	2023-05-11 16:02:27.524	\N
39	6	2	el mejor servicio lejos	7	2023-05-11 16:03:34.143	\N
40	6	2	el mejor servicio lejos	7	2023-05-11 16:03:57.092	\N
41	6	2	el mejor servicio lejos	7	2023-05-11 16:05:17.656	\N
42	6	2	el mejor servicio lejos	7	2023-05-11 16:07:12.944	\N
43	6	2	el mejor servicio lejos	7	2023-05-11 16:11:17.508	\N
44	6	2	el mejor servicio lejos	7	2023-05-11 16:11:35.94	\N
45	6	2	el mejor servicio lejos	7	2023-05-11 16:11:59.325	\N
46	6	2	el mejor servicio lejos	7	2023-05-11 16:12:56.677	\N
47	6	2	el mejor servicio lejos	7	2023-05-11 16:13:11.435	\N
48	6	2	el mejor servicio lejos	7	2023-05-11 16:13:26.826	\N
49	6	2	el mejor servicio lejos	7	2023-05-11 16:13:45.884	\N
50	6	2	el mejor servicio lejos	7	2023-05-11 16:14:21.988	\N
51	6	2	el mejor servicio lejos	8	2023-05-11 16:14:37.817	\N
52	6	2	el mejor servicio lejos	8	2023-05-11 16:15:28.664	\N
53	6	2	el mejor servicio lejos	8	2023-05-11 16:17:43.511	\N
54	49	2	el mejor servicio lejos	8	2023-05-11 16:18:38.832	\N
55	49	2	el mejor servicio lejos	7	2023-05-11 16:18:43.847	\N
56	49	2	el mejor servicio lejos	7	2023-05-11 16:19:15.397	\N
57	49	2	el mejor servicio lejos	6	2023-05-11 16:19:20.047	\N
58	49	2	el mejor servicio lejos	10	2023-05-11 16:19:30.053	\N
59	49	2	el mejor servicio lejos	10	2023-05-11 16:19:30.728	\N
60	49	2	el mejor servicio lejos	10	2023-05-11 16:19:33.368	\N
61	49	2	el mejor servicio lejos	10	2023-05-11 16:19:35.287	\N
62	49	2	el mejor servicio lejos	10	2023-05-11 16:20:31.156	\N
63	49	2	el mejor servicio lejos	10	2023-05-11 16:34:24.556	\N
64	49	2	el mejor servicio lejos	10	2023-05-11 16:35:25.347	\N
65	48	2	el mejor servicio lejos	10	2023-05-11 16:40:56.726	\N
66	48	2	el mejor servicio lejos	10	2023-05-11 16:43:23.537	\N
67	48	2	el mejor servicio lejos	10	2023-05-11 16:43:35.809	\N
68	48	2	el mejor servicio lejos	10	2023-05-11 16:43:48.122	\N
69	48	2	el mejor servicio lejos	10	2023-05-11 16:44:59.035	\N
70	4	2	el mejor servicio lejos	10	2023-05-11 16:49:46.464	\N
\.


--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract (id, status, date, customer_id, created_at, modified_at, amount, caregiver_id, horarios) FROM stdin;
1	active	15/06/2023	50	2023-06-13 11:46:21.859	2023-06-13 11:46:21.859	21	48	["03:00"]
2	active	15/06/2023	50	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	48	["03:30"]
4	active	14/06/2023	50	2023-06-13 12:16:31.982	2023-06-13 12:16:31.982	21	48	["02:30"]
8	active	17/06/2023	50	2023-06-13 14:09:11.084	2023-06-13 14:09:11.084	21	48	["04:30"]
10	active	11/06/2023	50	2023-06-13 14:57:00.427	2023-06-13 14:57:00.427	21	48	["03:00"]
11	active	11/06/2023	50	2023-06-13 14:57:05.688	2023-06-13 14:57:05.688	21	48	["02:30"]
12	active	10/06/2023	50	2023-06-13 14:57:10.611	2023-06-13 14:57:10.611	21	48	["02:30"]
13	active	10/06/2023	50	2023-06-13 15:04:51.517	2023-06-13 15:04:51.517	21	48	["02:00"]
3	inactive	15/06/2023	50	2023-06-13 12:15:32.325	2023-06-13 12:15:32.325	21	48	["04:30"]
5	inactive	14/06/2023	50	2023-06-13 13:06:44.39	2023-06-13 13:06:44.39	21	48	["05:30"]
9	inactive	02/06/2023	50	2023-06-13 14:44:05.229	2023-06-13 14:44:05.229	63	48	["04:30","05:30","02:00"]
6	cancelled	15/06/2023	50	2023-06-13 13:07:13.505	2023-06-13 13:07:13.505	21	48	["05:00"]
7	completed	16/06/2023	50	2023-06-13 13:30:48.454	2023-06-13 13:30:48.454	21	48	["04:30"]
14	active	26/06/2023	50	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	48	["19:30", "20:00", "20:30", "21:00"]
15	active	30/07/2023	50	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	48	["19:30", "20:00", "20:30", "21:00"]
16	active	08/08/2023	998	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	755	["19:30", "20:00", "20:30", "21:00"]
17	inactive	15/08/2023	998	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	755	["19:30", "20:00", "20:30", "21:00"]
18	inactive	19/08/2023	998	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	755	["19:30", "20:00", "20:30", "21:00"]
19	completed	15/05/2023	998	2023-06-13 12:14:41.018	2023-06-13 12:14:41.018	21	755	["19:30", "20:00", "20:30", "21:00"]
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (user_type_number, user_type, id) FROM stdin;
0	client	1
1	cuidador	2
2	admin	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, description, name, last_name, password, mail, type, created_at, modified_at, enabled, hourly_rate, average_review_score, address) FROM stdin;
755	descriptionnnn	firstname	asdasdsda	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	cuidador755	1	2023-06-03 12:53:35.977	2023-06-24 18:14:50.48	t	\N	\N	Avenida 9 de Julio 5, Buenos Aires, Argentina
31	qweeqw	123	123	\N	adsasd	0	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	t	\N	\N	\N
1	desccc	111111111111	111111111	\N	11111111111	1	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	f	45	\N	\N
53	\N	name	lastname	$2b$10$kkKaP6YOO.P/xgn1mpUFjOXf/IXXKnZm4FuDqVC237vQCGW5R.DGW	newwwuser@hotmail.com	0	2023-06-18 23:38:16.92	\N	t	\N	\N	direcc
51	descccccc	firstname	lastname	$2b$10$1SBtjnQPPuCXZIyuUErEMOctccTOXxl0lQzfUuBe5XYlTkATfPMpG	cuidador	1	2023-04-09 18:04:41.672	\N	t	\N	\N	\N
48	newwdescccc	updatedAgain	lastname	$2a$10$N0IU4mQeWMBBx0JacWifdOgSXsiKg3AejjuaWQ4RIJ9CUbsJTPOIi	asd	1	2023-04-09 18:04:41.672	2023-06-02 14:30:02.391	t	21	9.42	\N
6	The description	Josh	Peck	$2y$10$iKJBVKYUMF6u967o8KWBae8rcBYfyugYgO38WeBWSdXXQV56PQ6Z2	email@hotmail.com	1	2023-04-09 18:04:41.672	2023-05-11 15:58:45.628	t	75	7.55	\N
2	2222222	22222	222222	\N	222222	0	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	t	\N	\N	\N
4	1111111111	11111111	111111111111	\N	111111111	1	2023-04-09 18:04:41.672	2023-05-11 16:49:46.464	t	27	9.25	\N
998	descriptionnnn	998firstname	asdasdsda	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	client998	0	2023-06-03 12:53:35.977	2023-06-24 18:14:50.48	t	\N	\N	Avenida 9 de Julio 5, Buenos Aires, Argentina
52	descc	nombreUpdated20.03	apellido	$2b$10$iQHsqBx9LB7xNtmAxM5tmOBrMAzFC5iJFbErpTwPLldwAGL5XV1Hy	newuserrr@hotmail.com	0	2023-06-18 23:37:21.661	2023-07-01 20:03:56.631	t	\N	\N	\N
30	dasdsadsa	nombre20.04	wqwqrweqr	\N	wqeeqw	1	2023-04-09 18:04:41.672	2023-07-01 20:04:16.729	t	\N	\N	\N
50	descriptionnnn	50updatedat20.05	asdasdsda	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	clienteeee20.08	0	2023-06-03 12:53:35.977	2023-07-01 20:09:01.517	t	\N	\N	\N
54	admin_descriptionnnn	admin_firstnamee	admin_lastnameat20.15	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	admin	2	2023-06-03 12:53:35.977	2023-07-01 20:15:12.732	t	\N	\N	\N
55	asdasd	firstname	lastname	$2b$10$P1czp6ry81PQinRtjjCQoOoaUWGIy1BV3bSlkisZ4rAcDwm1M0B26	testing_create	1	2023-07-01 20:24:51.472	\N	t	\N	\N	\N
56	asdasddesc	firstname	lastname	$2b$10$aOBLXMe1eY/B.uzSLvT1wOrHtc8lWz9/e2iC9XBbJhjUPB/0DlK3e	testing_create2	0	2023-07-01 20:25:56.981	\N	t	\N	\N	\N
\.


--
-- Name: caregiver_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.caregiver_availability_id_seq', 9, true);


--
-- Name: caregiver_score_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.caregiver_score_id_seq', 70, true);


--
-- Name: contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_id_seq', 19, true);


--
-- Name: user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_type_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 56, true);


--
-- Name: caregiver_availability caregiver_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caregiver_availability
    ADD CONSTRAINT caregiver_availability_pkey PRIMARY KEY (id);


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
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
