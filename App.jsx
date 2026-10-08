import {
  Activity,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileUp,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  QrCode,
  RefreshCw,
  ScanLine,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserRound,
  UserX,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import "./styles.css";
import "./auth.css";

const API = "http://localhost:5000";

/* =========================================================
   THREE.JS CINEMATIC WORLD
========================================================= */

function ThreeWorld() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(
      0x07080b,
      0.035
    );

    const camera =
      new THREE.PerspectiveCamera(
        55,
        container.clientWidth /
          container.clientHeight,
        0.1,
        100
      );

    camera.position.set(
      0,
      1.2,
      10
    );

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    container.appendChild(
      renderer.domElement
    );

    const ambient =
      new THREE.AmbientLight(
        0xffffff,
        0.35
      );

    scene.add(ambient);

    const redLight =
      new THREE.PointLight(
        0xff2419,
        18,
        25
      );

    redLight.position.set(
      0,
      2,
      2
    );

    scene.add(redLight);

    const whiteLight =
      new THREE.PointLight(
        0xffffff,
        5,
        20
      );

    whiteLight.position.set(
      5,
      5,
      5
    );

    scene.add(whiteLight);

    /* CORE */

    const coreGroup =
      new THREE.Group();

    scene.add(coreGroup);

    const coreGeometry =
      new THREE.IcosahedronGeometry(
        1.15,
        2
      );

    const coreMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x100706,
        emissive: 0xff2419,
        emissiveIntensity: 1.6,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });

    const core =
      new THREE.Mesh(
        coreGeometry,
        coreMaterial
      );

    coreGroup.add(core);

    const innerGeometry =
      new THREE.SphereGeometry(
        0.58,
        32,
        32
      );

    const innerMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xff3024,
        transparent: true,
        opacity: 0.13,
      });

    const inner =
      new THREE.Mesh(
        innerGeometry,
        innerMaterial
      );

    coreGroup.add(inner);

    /* RINGS */

    const rings = [];

    [1.7, 2.2, 2.8].forEach(
      (radius, index) => {
        const geometry =
          new THREE.TorusGeometry(
            radius,
            0.012,
            8,
            100
          );

        const material =
          new THREE.MeshBasicMaterial({
            color:
              index === 1
                ? 0xffffff
                : 0xff392d,
            transparent: true,
            opacity: 0.42,
          });

        const ring =
          new THREE.Mesh(
            geometry,
            material
          );

        ring.rotation.x =
          Math.PI / 2 +
          index * 0.3;

        ring.rotation.y =
          index * 0.5;

        scene.add(ring);

        rings.push(ring);
      }
    );

    /* NETWORK NODES */

    const nodeGroup =
      new THREE.Group();

    scene.add(nodeGroup);

    const nodeGeometry =
      new THREE.SphereGeometry(
        0.045,
        12,
        12
      );

    const nodeMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xff392d,
      });

    const nodePositions = [];

    for (let i = 0; i < 45; i++) {
      const node =
        new THREE.Mesh(
          nodeGeometry,
          nodeMaterial
        );

      const radius =
        3.5 +
        Math.random() * 3;

      const angle =
        Math.random() *
        Math.PI *
        2;

      node.position.set(
        Math.cos(angle) *
          radius,
        (Math.random() - 0.5) *
          5,
        Math.sin(angle) *
          radius
      );

      nodeGroup.add(node);

      nodePositions.push(
        node.position.clone()
      );
    }

    for (
      let i = 0;
      i < nodePositions.length;
      i += 3
    ) {
      const a =
        nodePositions[i];

      const b =
        nodePositions[
          (i + 1) %
            nodePositions.length
        ];

      const geometry =
        new THREE.BufferGeometry()
          .setFromPoints([
            a,
            b,
          ]);

      const material =
        new THREE.LineBasicMaterial({
          color: 0xff3024,
          transparent: true,
          opacity: 0.12,
        });

      scene.add(
        new THREE.Line(
          geometry,
          material
        )
      );
    }

    /* PARTICLES */

    const particleCount = 1400;

    const positions =
      new Float32Array(
        particleCount * 3
      );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      positions[i * 3] =
        (Math.random() - 0.5) *
        30;

      positions[i * 3 + 1] =
        (Math.random() - 0.5) *
        18;

      positions[i * 3 + 2] =
        (Math.random() - 0.5) *
        30;
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    const particleMaterial =
      new THREE.PointsMaterial({
        color: 0x8c8c8c,
        size: 0.018,
        transparent: true,
        opacity: 0.5,
      });

    const particles =
      new THREE.Points(
        particleGeometry,
        particleMaterial
      );

    scene.add(particles);

    /* FLOATING CUBES */

    const cubes = [];

    for (let i = 0; i < 9; i++) {
      const geometry =
        new THREE.BoxGeometry(
          0.25,
          0.25,
          0.25
        );

      const material =
        new THREE.MeshBasicMaterial({
          color:
            i % 3 === 0
              ? 0xff392d
              : 0x3d3d43,
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });

      const cube =
        new THREE.Mesh(
          geometry,
          material
        );

      cube.position.set(
        (Math.random() - 0.5) *
          13,
        (Math.random() - 0.5) *
          8,
        (Math.random() - 0.5) *
          8
      );

      scene.add(cube);

      cubes.push(cube);
    }

    const mouse = {
      x: 0,
      y: 0,
    };

    function handleMouse(e) {
      mouse.x =
        (e.clientX /
          window.innerWidth -
          0.5) *
        2;

      mouse.y =
        (e.clientY /
          window.innerHeight -
          0.5) *
        2;
    }

    window.addEventListener(
      "mousemove",
      handleMouse
    );

    function handleResize() {
      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    const clock =
      new THREE.Clock();

    let frame;

    function animate() {
      frame =
        requestAnimationFrame(
          animate
        );

      const time =
        clock.getElapsedTime();

      core.rotation.x =
        time * 0.18;

      core.rotation.y =
        time * 0.25;

      inner.scale.setScalar(
        1 +
          Math.sin(time * 2) *
            0.08
      );

      rings.forEach(
        (ring, index) => {
          ring.rotation.z =
            time *
            (0.08 +
              index * 0.04);
        }
      );

      particles.rotation.y =
        time * 0.008;

      nodeGroup.rotation.y =
        time * 0.025;

      cubes.forEach(
        (cube, index) => {
          cube.rotation.x =
            time * 0.2 +
            index;

          cube.rotation.y =
            time * 0.3;
        }
      );

      camera.position.x +=
        (mouse.x * 0.45 -
          camera.position.x) *
        0.025;

      camera.position.y +=
        (1.2 -
          mouse.y * 0.3 -
          camera.position.y) *
        0.025;

      camera.lookAt(
        0,
        0.4,
        0
      );

      renderer.render(
        scene,
        camera
      );
    }

    animate();

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "mousemove",
        handleMouse
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.dispose();

      if (
        renderer.domElement &&
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-world"
    />
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `${API}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Authentication failed"
        );
      }

      onLogin(
        data.user,
        data.token
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to connect to authentication server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <ThreeWorld />

      <div className="cinematic-vignette" />

      <div className="auth-panel">
        <div className="auth-logo">
          <QrCode size={32} />
        </div>

        <div className="auth-eyebrow">
          ALIET / TECHPRENEUR CLUB
        </div>

        <h1>
          SMART
          <span>QR</span>
        </h1>

        <p>
          SECURE ATTENDANCE
          INFRASTRUCTURE
        </p>

        <form
          className="auth-form"
          onSubmit={submit}
        >
          <label>
            <small>
              ACCESS ID
            </small>

            <div className="auth-input">
              <UserRound size={17} />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />
            </div>
          </label>

          <label>
            <small>
              SECURITY KEY
            </small>

            <div className="auth-input">
              <Lock size={17} />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />
            </div>
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="primary auth-submit"
            disabled={loading}
          >
            <LogIn size={17} />

            {loading
              ? "AUTHENTICATING..."
              : "AUTHENTICATE"}
          </button>
        </form>

        <div className="auth-footer">
          <ShieldCheck size={14} />
          CRYPTOGRAPHICALLY
          PROTECTED ACCESS
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [user, setUser] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "smartqr_user"
          )
        );
      } catch {
        return null;
      }
    });

  const [authToken, setAuthToken] =
    useState(
      () =>
        localStorage.getItem(
          "smartqr_token"
        ) || ""
    );

  const [view, setView] =
    useState(() =>
      user?.role ===
      "volunteer"
        ? "scanner"
        : "command"
    );

  const [events, setEvents] =
    useState([]);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    attendees,
    setAttendees,
  ] = useState([]);

  const [stats, setStats] =
    useState({
      total: 0,
      present: 0,
      absent: 0,
      attendancePercentage: 0,
    });

  const [eventName, setEventName] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [venue, setVenue] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    volunteers,
    setVolunteers,
  ] = useState([]);

  const [
    volunteerName,
    setVolunteerName,
  ] = useState("");

  const [
    volunteerEmail,
    setVolunteerEmail,
  ] = useState("");

  const [
    volunteerPassword,
    setVolunteerPassword,
  ] = useState("");

  const [
    dashboardRefreshing,
    setDashboardRefreshing,
  ] = useState(false);

  const isAdmin =
    user?.role === "admin";

  const authHeaders = authToken
    ? {
        Authorization:
          `Bearer ${authToken}`,
      }
    : {};

  /* =======================================================
     LOGIN
  ======================================================= */

  function handleLogin(
    loggedUser,
    token
  ) {
    localStorage.setItem(
      "smartqr_user",
      JSON.stringify(
        loggedUser
      )
    );

    localStorage.setItem(
      "smartqr_token",
      token
    );

    setUser(loggedUser);
    setAuthToken(token);

    setView(
      loggedUser.role ===
        "volunteer"
        ? "scanner"
        : "command"
    );
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  function logout() {
    localStorage.removeItem(
      "smartqr_user"
    );

    localStorage.removeItem(
      "smartqr_token"
    );

    setUser(null);
    setAuthToken("");
  }

  /* =======================================================
     EVENTS
  ======================================================= */

  async function loadEvents(
    selectFirst = true
  ) {
    try {
      const response =
        await fetch(
          `${API}/api/events`
        );

      const data =
        await response.json();

      if (!response.ok)
        return;

      const nextEvents =
        data.events || [];

      setEvents(nextEvents);

      if (
        selectFirst &&
        !selectedEvent &&
        nextEvents.length
      ) {
        setSelectedEvent(
          nextEvents[0]
        );
      }

      if (selectedEvent) {
        const fresh =
          nextEvents.find(
            (event) =>
              event.id ===
              selectedEvent.id
          );

        if (fresh) {
          setSelectedEvent(
            fresh
          );
        }
      }
    } catch {
      setMessage(
        "BACKEND OFFLINE"
      );
    }
  }

  async function loadEventData(
    event
  ) {
    if (!event) return;

    try {
      const response =
        await fetch(
          `${API}/api/events/${event.id}/attendees`,
          {
            headers: {
              ...authHeaders,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          logout();
        }

        return;
      }

      const people =
        data.attendees || [];

      setAttendees(
        people
      );

      const total =
        people.length;

      const present =
        people.filter(
          (person) =>
            person.status ===
            "Present"
        ).length;

      setStats({
        total,
        present,
        absent:
          total - present,
        attendancePercentage:
          total
            ? Math.round(
                (present /
                  total) *
                  100
              )
            : 0,
      });
    } catch {
      setAttendees([]);
    }
  }

  /* =======================================================
     LIVE DASHBOARD
  ======================================================= */

  async function refreshDashboard() {
    if (!selectedEvent)
      return;

    setDashboardRefreshing(
      true
    );

    await Promise.all([
      loadEvents(false),
      loadEventData(
        selectedEvent
      ),
    ]);

    setDashboardRefreshing(
      false
    );
  }

  useEffect(() => {
    if (!user) return;

    loadEvents();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (selectedEvent) {
      loadEventData(
        selectedEvent
      );
    }
  }, [
    selectedEvent,
    user,
  ]);

  useEffect(() => {
    if (
      !user ||
      !selectedEvent
    )
      return;

    const interval =
      setInterval(
        () => {
          loadEventData(
            selectedEvent
          );

          if (isAdmin) {
            loadEvents(false);
          }
        },
        3000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    user,
    selectedEvent,
    isAdmin,
  ]);

  /* =======================================================
     CREATE EVENT
  ======================================================= */

  async function createEvent(e) {
    e.preventDefault();

    if (!eventName.trim())
      return;

    setBusy(true);

    try {
      const response =
        await fetch(
          `${API}/api/events`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...authHeaders,
            },

            body: JSON.stringify({
              name: eventName,
              date: eventDate,
              location: venue,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "EVENT CREATION FAILED"
        );

        return;
      }

      setMessage(
        "EVENT INITIALIZED"
      );

      setEventName("");
      setEventDate("");
      setVenue("");

      await loadEvents();

      if (data.event) {
        setSelectedEvent(
          data.event
        );
      }

      setView(
        "attendees"
      );
    } catch {
      setMessage(
        "EVENT CREATION FAILED"
      );
    } finally {
      setBusy(false);
    }
  }

  /* =======================================================
     CSV
  ======================================================= */

  async function uploadCSV(e) {
    const file =
      e.target.files?.[0];

    if (
      !file ||
      !selectedEvent
    ) {
      return;
    }

    setBusy(true);

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {
      const response =
        await fetch(
          `${API}/api/events/${selectedEvent.id}/attendees/upload`,
          {
            method: "POST",

            headers: {
              ...authHeaders,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "UPLOAD FAILED"
        );

        return;
      }

      setMessage(
        `${data.imported || 0} ATTENDEES INGESTED`
      );

      await loadEventData(
        selectedEvent
      );
    } catch {
      setMessage(
        "UPLOAD FAILED"
      );
    } finally {
      setBusy(false);

      e.target.value = "";
    }
  }

  /* =======================================================
     QR GENERATION
  ======================================================= */

  async function generateQRs() {
    if (!selectedEvent)
      return;

    setBusy(true);

    try {
      const response =
        await fetch(
          `${API}/api/events/${selectedEvent.id}/generate-qrs`,
          {
            method: "POST",

            headers: {
              ...authHeaders,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "QR GENERATION FAILED"
        );

        return;
      }

      setMessage(
        `${data.count || 0} SECURE PASSES GENERATED`
      );

      await loadEventData(
        selectedEvent
      );
    } catch {
      setMessage(
        "QR GENERATION FAILED"
      );
    } finally {
      setBusy(false);
    }
  }

  /* =======================================================
     VOLUNTEERS
  ======================================================= */

  async function loadVolunteers() {
    if (!isAdmin) return;

    try {
      const response =
        await fetch(
          `${API}/api/auth/volunteers`,
          {
            headers: {
              ...authHeaders,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok)
        return;

      setVolunteers(
        data.volunteers || []
      );
    } catch {
      setVolunteers([]);
    }
  }

  useEffect(() => {
    if (
      user &&
      isAdmin &&
      view === "volunteers"
    ) {
      loadVolunteers();
    }
  }, [
    user,
    isAdmin,
    view,
  ]);

  async function createVolunteer(
    e
  ) {
    e.preventDefault();

    if (
      !volunteerName ||
      !volunteerEmail ||
      !volunteerPassword
    ) {
      setMessage(
        "COMPLETE ALL VOLUNTEER FIELDS"
      );

      return;
    }

    setBusy(true);

    try {
      const response =
        await fetch(
          `${API}/api/auth/volunteers`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...authHeaders,
            },

            body: JSON.stringify({
              name:
                volunteerName,

              email:
                volunteerEmail,

              password:
                volunteerPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "VOLUNTEER CREATION FAILED"
        );

        return;
      }

      setMessage(
        "VOLUNTEER CREATED — WAITING FOR APPROVAL"
      );

      setVolunteerName("");
      setVolunteerEmail("");
      setVolunteerPassword("");

      await loadVolunteers();
    } catch {
      setMessage(
        "VOLUNTEER CREATION FAILED"
      );
    } finally {
      setBusy(false);
    }
  }

  async function approveVolunteer(
    id
  ) {
    try {
      const response =
        await fetch(
          `${API}/api/auth/volunteers/${id}/approve`,
          {
            method: "PATCH",

            headers: {
              ...authHeaders,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "APPROVAL FAILED"
        );

        return;
      }

      setMessage(
        "VOLUNTEER ACCESS GRANTED"
      );

      await loadVolunteers();
    } catch {
      setMessage(
        "APPROVAL FAILED"
      );
    }
  }

  async function revokeVolunteer(
    id
  ) {
    try {
      const response =
        await fetch(
          `${API}/api/auth/volunteers/${id}/revoke`,
          {
            method: "PATCH",

            headers: {
              ...authHeaders,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "REVOCATION FAILED"
        );

        return;
      }

      setMessage(
        "VOLUNTEER ACCESS REVOKED"
      );

      await loadVolunteers();
    } catch {
      setMessage(
        "REVOCATION FAILED"
      );
    }
  }

  const present =
    useMemo(
      () =>
        attendees.filter(
          (person) =>
            person.status ===
            "Present"
        ),
      [attendees]
    );

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (!user) {
    return (
      <Login
        onLogin={
          handleLogin
        }
      />
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="app-shell">
      <ThreeWorld />

      <div className="cinematic-vignette" />

      <div className="scan-beam" />

      {/* TOPBAR */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <QrCode size={22} />
          </div>

          <div>
            <strong>
              ALIET
              <span className="brand-red">
                /
              </span>
              SMART QR
            </strong>

            <span>
              TECHPRENEUR CLUB
            </span>
          </div>
        </div>

        <div className="system-status">
          <span className="status-light" />

          SECURE NETWORK

          <b>ONLINE</b>

          <span className="user-badge">
            {user.name}
            {" / "}
            {user.role.toUpperCase()}
          </span>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut
              size={13}
            />
            LOGOUT
          </button>
        </div>
      </header>

      <main className="interface">
        {/* HERO */}

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />

              ATTENDANCE
              INFRASTRUCTURE

              <span />

              01
            </div>

            <h1>
              Attendance
              <br />

              <span>
                re-engineered.
              </span>
            </h1>

            <p>
              A secure attendance
              infrastructure built
              for speed,
              authenticity and
              real-time control.
            </p>

            <div className="hero-buttons">
              {isAdmin && (
                <button
                  className="primary"
                  onClick={() =>
                    setView(
                      "create"
                    )
                  }
                >
                  INITIALIZE EVENT

                  <ChevronRight
                    size={17}
                  />
                </button>
              )}

              <button
                className="glass-button"
                onClick={() =>
                  setView(
                    "scanner"
                  )
                }
              >
                <ScanLine
                  size={17}
                />

                OPEN SCANNER
              </button>
            </div>
          </div>

          <div className="hud-card">
            <div className="hud-top">
              <span>
                NETWORK CORE
              </span>

              <i>●</i>
            </div>

            <div className="hud-center">
              <div className="hud-ring">
                <QrCode
                  size={45}
                />
              </div>
            </div>

            <div className="hud-data">
              <span>
                AUTH
              </span>

              <b>
                SHA-256
              </b>

              <span>
                ROLE
              </span>

              <b>
                {user.role.toUpperCase()}
              </b>
            </div>
          </div>
        </section>

        {/* COMMAND */}

        <section className="command-shell">
          <aside className="sidebar">
            <div className="section-label">
              COMMAND DECK
            </div>

            <NavButton
              id="command"
              label="Command"
              icon={
                LayoutDashboard
              }
              view={view}
              setView={setView}
            />

            {isAdmin && (
              <>
                <NavButton
                  id="create"
                  label="Create Event"
                  icon={Zap}
                  view={view}
                  setView={setView}
                />

                <NavButton
                  id="attendees"
                  label="Attendees"
                  icon={Users}
                  view={view}
                  setView={setView}
                />

                <NavButton
                  id="volunteers"
                  label="Volunteers"
                  icon={
                    UserCheck
                  }
                  view={view}
                  setView={setView}
                />
              </>
            )}

            <NavButton
              id="scanner"
              label="Live Scanner"
              icon={Camera}
              view={view}
              setView={setView}
            />

            <div className="security-module">
              <ShieldCheck
                size={21}
              />

              <b>
                SECURE
                <br />
                VERIFICATION
              </b>

              <span>
                Cryptographically
                signed QR
                payloads.
              </span>
            </div>
          </aside>

          <section className="workspace">
            {/* COMMAND */}

            {view ===
              "command" && (
              <CommandView
                selectedEvent={
                  selectedEvent
                }
                stats={stats}
                present={
                  present
                }
                refreshing={
                  dashboardRefreshing
                }
                refresh={
                  refreshDashboard
                }
                setView={
                  setView
                }
              />
            )}

            {/* CREATE */}

            {view ===
              "create" &&
              isAdmin && (
                <CreateEvent
                  eventName={
                    eventName
                  }
                  setEventName={
                    setEventName
                  }
                  eventDate={
                    eventDate
                  }
                  setEventDate={
                    setEventDate
                  }
                  venue={venue}
                  setVenue={
                    setVenue
                  }
                  createEvent={
                    createEvent
                  }
                  events={events}
                  setSelectedEvent={
                    setSelectedEvent
                  }
                  setView={setView}
                  busy={busy}
                />
              )}

            {/* ATTENDEES */}

            {view ===
              "attendees" &&
              isAdmin && (
                <Attendees
                  selectedEvent={
                    selectedEvent
                  }
                  attendees={
                    attendees
                  }
                  uploadCSV={
                    uploadCSV
                  }
                  generateQRs={
                    generateQRs
                  }
                  busy={busy}
                />
              )}

            {/* VOLUNTEERS */}

            {view ===
              "volunteers" &&
              isAdmin && (
                <VolunteerManagement
                  volunteers={
                    volunteers
                  }
                  name={
                    volunteerName
                  }
                  setName={
                    setVolunteerName
                  }
                  email={
                    volunteerEmail
                  }
                  setEmail={
                    setVolunteerEmail
                  }
                  password={
                    volunteerPassword
                  }
                  setPassword={
                    setVolunteerPassword
                  }
                  create={
                    createVolunteer
                  }
                  approve={
                    approveVolunteer
                  }
                  revoke={
                    revokeVolunteer
                  }
                  busy={busy}
                />
              )}

            {/* SCANNER */}

            {view ===
              "scanner" && (
              <Scanner
                authToken={
                  authToken
                }
                selectedEvent={
                  selectedEvent
                }
                stats={stats}
                refresh={
                  refreshDashboard
                }
              />
            )}
          </section>
        </section>
      </main>

      {message && (
        <Toast
          message={message}
          close={() =>
            setMessage("")
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   NAV BUTTON
========================================================= */

function NavButton({
  id,
  label,
  icon: Icon,
  view,
  setView,
}) {
  return (
    <button
      className={
        view === id
          ? "nav-item active"
          : "nav-item"
      }
      onClick={() =>
        setView(id)
      }
    >
      <Icon size={16} />

      <span>
        {label}
      </span>

      <ChevronRight
        size={13}
      />
    </button>
  );
}

/* =========================================================
   COMMAND / LIVE DASHBOARD
========================================================= */

function CommandView({
  selectedEvent,
  stats,
  present,
  refreshing,
  refresh,
  setView,
}) {
  const recent =
    present
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.checkedInAt ||
              0
          ) -
          new Date(
            a.checkedInAt ||
              0
          )
      )
      .slice(0, 8);

  return (
    <>
      <div className="workspace-header">
        <div>
          <small>
            LIVE EVENT CONTROL
          </small>

          <h2>
            {selectedEvent?.name ||
              "NO EVENT INITIALIZED"}
          </h2>

          {selectedEvent?.location && (
            <small>
              {selectedEvent.location}
            </small>
          )}
        </div>

        <div className="live">
          <i />

          LIVE

          <button
            className="dashboard-refresh"
            onClick={refresh}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />
          </button>
        </div>
      </div>

      {/* BIG METRICS */}

      <div className="metrics">
        <Metric
          label="REGISTERED"
          value={stats.total}
          icon={Users}
        />

        <Metric
          label="PRESENT"
          value={stats.present}
          icon={
            CheckCircle2
          }
        />

        <Metric
          label="ABSENT"
          value={stats.absent}
          icon={UserX}
        />

        <Metric
          label="ATTENDANCE"
          value={`${stats.attendancePercentage}%`}
          icon={Activity}
        />
      </div>

      {/* LIVE COMMAND GRID */}

      <div className="dashboard-grid">
        {/* ATTENDANCE CORE */}

        <div className="command-visual dashboard-core">
          <div className="core-label top">
            LIVE
            SYNCHRONIZATION
          </div>

          <div className="core-status">
            <span />
            SYSTEM CORE
          </div>

          <div className="core-readout">
            {stats.attendancePercentage}
            <small>%</small>
          </div>

          <div className="core-caption">
            ATTENDANCE
            <br />
            SYNCHRONIZATION
          </div>

          <div className="core-footer">
            <span>
              {stats.present}
              {" / "}
              {stats.total}
            </span>

            VERIFIED
          </div>
        </div>

        {/* RECENT STREAM */}

        <div className="activity-panel live-stream">
          <div className="panel-heading">
            <span>
              LIVE CHECK-IN STREAM
            </span>

            <small>
              {stats.present}
              {" VERIFIED"}
            </small>
          </div>

          {recent.length ? (
            recent.map(
              (person) => (
                <div
                  className="activity-row"
                  key={person.id}
                >
                  <div className="activity-avatar">
                    <UserRound
                      size={15}
                    />
                  </div>

                  <div>
                    <b>
                      {person.name}
                    </b>

                    <small>
                      {person.email}
                    </small>
                  </div>

                  <div className="activity-time">
                    {person.checkedInAt
                      ? new Date(
                          person.checkedInAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                            second:
                              "2-digit",
                          }
                        )
                      : "--:--:--"}

                    <strong>
                      VERIFIED
                    </strong>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="empty-state">
              <ScanLine
                size={30}
              />

              <span>
                AWAITING VERIFIED
                CHECK-INS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ATTENDANCE BAR */}

      <div className="attendance-panel">
        <div className="panel-heading">
          <span>
            ATTENDANCE PROGRESS
          </span>

          <strong>
            {stats.present}
            /
            {stats.total}
          </strong>
        </div>

        <div className="attendance-track">
          <div
            className="attendance-fill"
            style={{
              width: `${stats.attendancePercentage}%`,
            }}
          />
        </div>

        <div className="attendance-foot">
          <span>
            {stats.absent} attendees
            remaining
          </span>

          <b>
            {stats.attendancePercentage}%
            COMPLETE
          </b>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">
        <button
          className="glass-button"
          onClick={() =>
            setView(
              "scanner"
            )
          }
        >
          <Camera size={16} />
          OPEN LIVE SCANNER
          <ArrowUpRight
            size={14}
          />
        </button>
      </div>
    </>
  );
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="metric-card">
      <Icon size={17} />

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   CREATE EVENT
========================================================= */

function CreateEvent({
  eventName,
  setEventName,
  eventDate,
  setEventDate,
  venue,
  setVenue,
  createEvent,
  events,
  setSelectedEvent,
  setView,
  busy,
}) {
  return (
    <div>
      <div className="workspace-header">
        <div>
          <small>
            ADMIN PROTOCOL
          </small>

          <h2>
            Initialize Event
          </h2>
        </div>
      </div>

      <form
        onSubmit={createEvent}
        className="event-form"
      >
        <Field
          label="EVENT NAME"
          value={eventName}
          set={setEventName}
          placeholder="Techpreneur Fest 2026"
        />

        <Field
          label="DATE"
          value={eventDate}
          set={setEventDate}
          type="date"
        />

        <Field
          label="VENUE"
          value={venue}
          set={setVenue}
          placeholder="ALIET Main Block"
        />

        <button
          className="primary full"
          disabled={busy}
        >
          {busy
            ? "INITIALIZING..."
            : "CREATE SECURE EVENT"}

          <ChevronRight
            size={16}
          />
        </button>
      </form>

      <div className="existing">
        <div className="section-label">
          EVENT REGISTRY
        </div>

        {events.map(
          (event) => (
            <button
              key={event.id}
              onClick={() => {
                setSelectedEvent(
                  event
                );

                setView(
                  "attendees"
                );
              }}
            >
              <span>
                {event.name}
              </span>

              <small>
                {event.attendeeCount ||
                  0}
                {" ATTENDEES"}
              </small>
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  set,
  type = "text",
  placeholder,
}) {
  return (
    <label className="field">
      <small>
        {label}
      </small>

      <input
        type={type}
        value={value}
        placeholder={
          placeholder
        }
        onChange={(e) =>
          set(
            e.target.value
          )
        }
      />
    </label>
  );
}

/* =========================================================
   ATTENDEES
========================================================= */

function Attendees({
  selectedEvent,
  attendees,
  uploadCSV,
  generateQRs,
  busy,
}) {
  return (
    <div>
      <div className="workspace-header">
        <div>
          <small>
            EVENT PIPELINE
          </small>

          <h2>
            {selectedEvent?.name ||
              "SELECT EVENT"}
          </h2>
        </div>
      </div>

      <label className="upload">
        <FileUp size={31} />

        <b>
          INGEST ATTENDEE DATA
        </b>

        <span>
          Select CSV File
        </span>

        <input
          type="file"
          accept=".csv"
          onChange={
            uploadCSV
          }
        />
      </label>

      <button
        className="primary full"
        onClick={
          generateQRs
        }
        disabled={
          busy ||
          !selectedEvent ||
          attendees.length ===
            0
        }
      >
        <QrCode size={16} />

        {busy
          ? "GENERATING..."
          : "GENERATE SECURE PASSES"}
      </button>

      <div className="people">
        {attendees.map(
          (person) => (
            <div
              className="person"
              key={person.id}
            >
              <div>
                <b>
                  {person.name}
                </b>

                <small>
                  {person.email}
                </small>
              </div>

              <span
                className={
                  person.status ===
                  "Present"
                    ? "person-present"
                    : ""
                }
              >
                {person.status}
              </span>

              <span>
                {person.qrGenerated
                  ? "QR READY"
                  : "PENDING"}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   VOLUNTEER MANAGEMENT
========================================================= */

function VolunteerManagement({
  volunteers,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  create,
  approve,
  revoke,
  busy,
}) {
  return (
    <div>
      <div className="workspace-header">
        <div>
          <small>
            ACCESS CONTROL
          </small>

          <h2>
            Volunteer Command
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,.42)",
              fontSize:
                "11px",
              marginTop:
                "8px",
            }}
          >
            Create scanner
            operators and
            control their
            access.
          </p>
        </div>

        <div className="live">
          <i />
          ADMIN ONLY
        </div>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "minmax(280px,.75fr) minmax(320px,1.25fr)",
          gap: "18px",
        }}
      >
        {/* CREATE */}

        <form
          onSubmit={create}
          style={{
            padding:
              "24px",
            border:
              "1px solid rgba(255,255,255,.08)",
            background:
              "rgba(255,255,255,.025)",
          }}
        >
          <div
            className="section-label"
            style={{
              marginBottom:
                "20px",
            }}
          >
            NEW VOLUNTEER
          </div>

          <VolunteerField
            label="FULL NAME"
            value={name}
            set={setName}
            placeholder="Volunteer name"
          />

          <VolunteerField
            label="EMAIL"
            value={email}
            set={setEmail}
            placeholder="volunteer@email.com"
            type="email"
          />

          <VolunteerField
            label="PASSWORD"
            value={password}
            set={setPassword}
            placeholder="Temporary password"
            type="password"
          />

          <button
            className="primary full"
            disabled={busy}
            style={{
              marginTop:
                "10px",
            }}
          >
            <UserPlus
              size={16}
            />

            CREATE VOLUNTEER
          </button>
        </form>

        {/* LIST */}

        <div>
          <div
            className="section-label"
            style={{
              marginBottom:
                "14px",
            }}
          >
            ACCESS REGISTRY
          </div>

          {volunteers.length ===
          0 ? (
            <div
              className="empty-state"
              style={{
                minHeight:
                  "200px",
              }}
            >
              <Users size={30} />

              <span>
                NO VOLUNTEERS
                REGISTERED
              </span>
            </div>
          ) : (
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "8px",
              }}
            >
              {volunteers.map(
                (
                  volunteer
                ) => (
                  <div
                    key={
                      volunteer.id
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "14px",
                      padding:
                        "16px",
                      border:
                        "1px solid rgba(255,255,255,.07)",
                      background:
                        "rgba(255,255,255,.02)",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "38px",
                        height:
                          "38px",
                        display:
                          "grid",
                        placeItems:
                          "center",
                        border:
                          "1px solid rgba(255,255,255,.1)",
                      }}
                    >
                      <CircleUserRound
                        size={18}
                      />
                    </div>

                    <div
                      style={{
                        flex:
                          1,
                        minWidth:
                          0,
                      }}
                    >
                      <b
                        style={{
                          display:
                            "block",
                          fontSize:
                            "12px",
                        }}
                      >
                        {
                          volunteer.name
                        }
                      </b>

                      <small
                        style={{
                          display:
                            "block",
                          color:
                            "rgba(255,255,255,.38)",
                          marginTop:
                            "4px",
                        }}
                      >
                        {
                          volunteer.email
                        }
                      </small>
                    </div>

                    <span
                      style={{
                        fontSize:
                          "8px",
                        letterSpacing:
                          "1.5px",
                        padding:
                          "7px 9px",
                        border:
                          "1px solid rgba(255,255,255,.08)",
                        color:
                          volunteer.approved
                            ? "#ff5b50"
                            : "#777",
                      }}
                    >
                      {volunteer.approved
                        ? "APPROVED"
                        : "PENDING"}
                    </span>

                    {!volunteer.approved ? (
                      <button
                        className="glass-button"
                        onClick={() =>
                          approve(
                            volunteer.id
                          )
                        }
                        style={{
                          padding:
                            "8px 11px",
                        }}
                      >
                        <Check
                          size={13}
                        />
                        APPROVE
                      </button>
                    ) : (
                      <button
                        className="glass-button"
                        onClick={() =>
                          revoke(
                            volunteer.id
                          )
                        }
                        style={{
                          padding:
                            "8px 11px",
                        }}
                      >
                        <UserX
                          size={13}
                        />
                        REVOKE
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VolunteerField({
  label,
  value,
  set,
  placeholder,
  type = "text",
}) {
  return (
    <label
      style={{
        display:
          "block",
        marginBottom:
          "16px",
      }}
    >
      <small
        style={{
          display:
            "block",
          fontSize:
            "9px",
          letterSpacing:
            "2px",
          color:
            "rgba(255,255,255,.42)",
          marginBottom:
            "8px",
        }}
      >
        {label}
      </small>

      <input
        type={type}
        value={value}
        placeholder={
          placeholder
        }
        onChange={(e) =>
          set(
            e.target.value
          )
        }
        style={{
          width:
            "100%",
          height:
            "46px",
          padding:
            "0 13px",
          boxSizing:
            "border-box",
          background:
            "rgba(255,255,255,.025)",
          border:
            "1px solid rgba(255,255,255,.1)",
          outline:
            "none",
          color:
            "#fff",
        }}
      />
    </label>
  );
}

/* =========================================================
   CINEMATIC SCANNER
========================================================= */

function Scanner({
  authToken,
  selectedEvent,
  stats,
  refresh,
}) {
  const scannerRef =
    useRef(null);

  const processingRef =
    useRef(false);

  const [status, setStatus] =
    useState("READY");

  const [result, setResult] =
    useState(null);

  const [scanCount, setScanCount] =
    useState(0);

  const [
    cameraActive,
    setCameraActive,
  ] = useState(false);

  const statusType =
    status ===
    "CHECK-IN SUCCESS"
      ? "success"
      : status ===
          "ALREADY CHECKED IN"
        ? "warning"
        : status ===
            "INVALID QR"
          ? "error"
          : "";

  async function startScanner() {
    if (
      scannerRef.current ||
      processingRef.current
    ) {
      return;
    }

    setResult(null);
    setStatus(
      "INITIALIZING CAMERA"
    );

    try {
      const {
        Html5Qrcode,
      } = await import(
        "html5-qrcode"
      );

      const scanner =
        new Html5Qrcode(
          "qr-reader"
        );

      scannerRef.current =
        scanner;

      await scanner.start(
        {
          facingMode:
            "environment",
        },
        {
          fps: 12,

          qrbox: {
            width: 270,
            height: 270,
          },

          aspectRatio:
            1,
        },

        async (
          decodedText
        ) => {
          if (
            processingRef.current
          ) {
            return;
          }

          processingRef.current =
            true;

          setStatus(
            "VERIFYING PASS"
          );

          try {
            await scanner.stop();

            const response =
              await fetch(
                `${API}/api/scan/verify`,
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization:
                      `Bearer ${authToken}`,
                  },

                  body: JSON.stringify(
                    {
                      token:
                        decodedText,
                    }
                  ),
                }
              );

            const data =
              await response.json();

            setScanCount(
              (count) =>
                count + 1
            );

            if (
              response.ok
            ) {
              setStatus(
                "CHECK-IN SUCCESS"
              );

              setResult({
                type:
                  "success",

                name:
                  data.attendee
                    ?.name ||
                  "Attendee",

                email:
                  data.attendee
                    ?.email ||
                  "",

                time:
                  data.attendee
                    ?.checkedInAt,

                message:
                  "Attendance verified successfully.",
              });

              if (refresh) {
                await refresh();
              }
            } else if (
              data.code ===
              "ALREADY_CHECKED_IN"
            ) {
              setStatus(
                "ALREADY CHECKED IN"
              );

              setResult({
                type:
                  "warning",

                name:
                  data.attendee
                    ?.name ||
                  "Attendee",

                email:
                  data.attendee
                    ?.email ||
                  "",

                time:
                  data.attendee
                    ?.checkedInAt,

                message:
                  "This pass has already been used.",
              });
            } else {
              setStatus(
                "INVALID QR"
              );

              setResult({
                type:
                  "error",

                name:
                  "UNKNOWN PASS",

                email:
                  "",

                message:
                  data.message ||
                  "QR verification failed.",
              });
            }
          } catch (error) {
            console.error(
              error
            );

            setStatus(
              "SYSTEM ERROR"
            );

            setResult({
              type:
                "error",

              name:
                "CONNECTION ERROR",

              message:
                "Unable to reach attendance server.",
            });
          } finally {
            scannerRef.current =
              null;

            setCameraActive(
              false
            );

            processingRef.current =
              false;
          }
        },

        () => {
          /* Normal scanner misses */
        }
      );

      setCameraActive(
        true
      );

      setStatus(
        "SCANNING"
      );
    } catch (error) {
      console.error(
        error
      );

      scannerRef.current =
        null;

      setCameraActive(
        false
      );

      setStatus(
        "CAMERA ACCESS FAILED"
      );

      setResult({
        type:
          "error",

        name:
          "CAMERA ERROR",

        message:
          "Allow camera access and try again.",
      });

      processingRef.current =
        false;
    }
  }

  async function stopScanner() {
    try {
      if (
        scannerRef.current
      ) {
        await scannerRef.current.stop();

        scannerRef.current.clear();

        scannerRef.current =
          null;
      }
    } catch (error) {
      console.error(
        error
      );
    }

    processingRef.current =
      false;

    setCameraActive(
      false
    );

    setStatus("READY");
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const present =
    stats?.present || 0;

  const total =
    stats?.total || 0;

  const percentage =
    stats?.attendancePercentage ||
    0;

  return (
    <div className="cinematic-scanner">
      {/* HEADER */}

      <div className="scanner-command-header">
        <div>
          <small>
            VOLUNTEER ACCESS
          </small>

          <h2>
            LIVE VERIFICATION
          </h2>

          <span>
            {selectedEvent?.name ||
              "NO EVENT SELECTED"}
          </span>
        </div>

        <div className="scanner-live-indicator">
          <span />
          CAMERA
          {cameraActive
            ? " ACTIVE"
            : " STANDBY"}
        </div>
      </div>

      {/* SCANNER GRID */}

      <div className="scanner-command-grid">
        {/* CAMERA */}

        <div className="scanner-camera-panel">
          <div className="scanner-camera-top">
            <span>
              <Activity
                size={13}
              />
              SECURE CHANNEL
            </span>

            <span>
              SCAN #{scanCount + 1}
            </span>
          </div>

          <div
            className={`scanner-frame-shell ${statusType}`}
          >
            <div
              id="qr-reader"
              className="qr-reader cinematic-reader"
            />

            {!cameraActive && (
              <div className="scanner-idle">
                <div className="scanner-idle-core">
                  <QrCode
                    size={48}
                  />
                </div>

                <b>
                  READY TO
                  <br />
                  VERIFY PASS
                </b>

                <span>
                  Position the
                  attendee QR
                  inside the
                  verification
                  frame.
                </span>
              </div>
            )}

            {cameraActive && (
              <>
                <div className="scanner-corner tl" />
                <div className="scanner-corner tr" />
                <div className="scanner-corner bl" />
                <div className="scanner-corner br" />

                <div className="scanner-target">
                  <div />
                </div>

                <div className="scanner-sweep" />

                <div className="scanner-crosshair">
                  <span />
                  <span />
                </div>
              </>
            )}

            <div className="scanner-tech-data">
              <span>
                AUTH
                <b>
                  JWT
                </b>
              </span>

              <span>
                ENCRYPTION
                <b>
                  ACTIVE
                </b>
              </span>

              <span>
                MODE
                <b>
                  LIVE
                </b>
              </span>
            </div>
          </div>

          <div
            className={`scanner-state ${statusType}`}
          >
            <span />

            {status}
          </div>

          {/* RESULT */}

          {result && (
            <ScanResult
              result={result}
            />
          )}

          {/* ACTION */}

          {!cameraActive ? (
            <button
              className="primary scanner-action"
              onClick={
                startScanner
              }
            >
              <Camera
                size={18}
              />

              ACTIVATE CAMERA

              <ChevronRight
                size={16}
              />
            </button>
          ) : (
            <button
              className="glass-button scanner-action"
              onClick={
                stopScanner
              }
            >
              <X size={16} />

              STOP SCANNER
            </button>
          )}
        </div>

        {/* RIGHT SIDE */}

        <div className="scanner-intel">
          <div className="scanner-intel-card">
            <div className="panel-heading">
              <span>
                EVENT TELEMETRY
              </span>

              <Activity
                size={14}
              />
            </div>

            <div className="telemetry-big">
              <strong>
                {percentage}
                <small>%</small>
              </strong>

              <span>
                ATTENDANCE
              </span>
            </div>

            <div className="telemetry-bar">
              <div
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <div className="telemetry-stats">
              <div>
                <b>
                  {present}
                </b>

                <span>
                  PRESENT
                </span>
              </div>

              <div>
                <b>
                  {total -
                    present}
                </b>

                <span>
                  ABSENT
                </span>
              </div>

              <div>
                <b>
                  {total}
                </b>

                <span>
                  TOTAL
                </span>
              </div>
            </div>
          </div>

          <div className="scanner-intel-card security-card">
            <div className="security-icon">
              <Shield
                size={21}
              />
            </div>

            <div>
              <b>
                SECURE VERIFICATION
              </b>

              <span>
                Every QR payload is
                cryptographically
                verified before
                attendance is
                recorded.
              </span>
            </div>

            <CheckCircle2
              size={17}
              className="security-check"
            />
          </div>

          <div className="scanner-intel-card">
            <div className="panel-heading">
              <span>
                OPERATOR
              </span>
            </div>

            <div className="operator-card">
              <div className="operator-avatar">
                <UserRound
                  size={20}
                />
              </div>

              <div>
                <b>
                  VOLUNTEER
                </b>

                <span>
                  AUTHENTICATED
                  OPERATOR
                </span>
              </div>

              <div className="operator-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCAN RESULT
========================================================= */

function ScanResult({
  result,
}) {
  const success =
    result.type ===
    "success";

  const warning =
    result.type ===
    "warning";

  return (
    <div
      className={`cinematic-result ${result.type}`}
    >
      <div className="result-icon">
        {success && (
          <Check
            size={22}
          />
        )}

        {warning && (
          <ShieldCheck
            size={22}
          />
        )}

        {!success &&
          !warning && (
            <X size={22} />
          )}
      </div>

      <div className="result-copy">
        <small>
          {success
            ? "ACCESS GRANTED"
            : warning
              ? "PASS ALREADY USED"
              : "ACCESS DENIED"}
        </small>

        <b>
          {result.name}
        </b>

        {result.email && (
          <span>
            {result.email}
          </span>
        )}

        <p>
          {result.message}
        </p>

        {result.time && (
          <time>
            {new Date(
              result.time
            ).toLocaleTimeString(
              [],
              {
                hour:
                  "2-digit",
                minute:
                  "2-digit",
                second:
                  "2-digit",
              }
            )}
          </time>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TOAST
========================================================= */

function Toast({
  message,
  close,
}) {
  useEffect(() => {
    const timer =
      setTimeout(
        close,
        4000
      );

    return () =>
      clearTimeout(
        timer
      );
  }, [close]);

  return (
    <div className="toast cinematic-toast">
      <span />

      <Zap size={14} />

      {message}

      <button
        onClick={close}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default App;