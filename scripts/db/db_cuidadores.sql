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
    id integer NOT NULL,
    user_type_number character varying(5) NOT NULL,
    user_type character varying(99) NOT NULL
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
    created_at timestamp without time zone,
    modified_at timestamp without time zone,
    enabled boolean,
    hourly_rate double precision,
    average_review_score numeric
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
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: caregiver_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.caregiver_availability (id, caregiver_id, dates) FROM stdin;
3	48	{"14/05/2023":["04:00","04:30","05:00"],"15/05/2023":["05:00","05:30","06:00"],"16/05/2023":["06:30","07:00","07:30"],"17/05/2023":["08:00","08:30","09:00"]}
9	4	{"30/05/2023":["06:30","07:00","07:30"],"31/05/2023":["08:00","08:30","09:00"]}
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

COPY public.contract (id, status, start, "end", customer_id, created_at, modified_at, amount) FROM stdin;
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (id, user_type_number, user_type) FROM stdin;
0	0	client
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, description, name, last_name, password, mail, type, created_at, modified_at, enabled, hourly_rate, average_review_score) FROM stdin;
48	The description	firstname	lastname	$2a$10$N0IU4mQeWMBBx0JacWifdOgSXsiKg3AejjuaWQ4RIJ9CUbsJTPOIi	asd	1	\N	2023-05-11 16:44:59.035	t	35	9.42
4	1111111111	11111111	111111111111	\N	111111111	1	\N	2023-05-11 16:49:46.464	t	27	9.25
31	qweeqw	123	123	\N	adsasd	0	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	t	\N	\N
2	2222222	22222	222222	\N	222222	0	\N	2023-05-11 15:47:46.231	t	\N	\N
1	desccc	111111111111	111111111	\N	11111111111	1	\N	2023-05-11 15:47:46.231	f	45	\N
30	dasdsadsa	zxczcxczx	wqwqrweqr	\N	wqeeqw	1	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	t	15	\N
6	The description	Josh	Peck	$2y$10$iKJBVKYUMF6u967o8KWBae8rcBYfyugYgO38WeBWSdXXQV56PQ6Z2	email@hotmail.com	1	\N	2023-05-11 15:58:45.628	t	75	7.55
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

SELECT pg_catalog.setval('public.contract_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 49, true);


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
-- Name: user_type id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

