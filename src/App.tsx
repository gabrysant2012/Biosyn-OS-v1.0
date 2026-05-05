/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Signal, 
  Battery, 
  Wifi, 
  MessageSquare, 
  ClipboardList, 
  Users, 
  Thermometer, 
  Radar as RadarIcon,
  Search,
  Zap,
  ZapOff,
  Shield,
  ShieldAlert,
  Cpu,
  Radio,
  Landmark,
  Power,
  Bell,
  Menu,
  ChevronLeft,
  AlertTriangle,
  ShieldOff,
  Video,
  VideoOff,
  Camera as CameraIcon
} from 'lucide-react';
import { AppId, Dinosaur, SecurityEvent, Personnel, Camera } from './types';

// Mock Data
const INITIAL_CAMERAS: Camera[] = [
  { id: 'CAM-01', name: 'SERVER-ROOM-01', location: 'Sala Server Centrale', position: { x: 50, y: 55 }, isOnline: false, status: 'offline', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-02', name: 'PADDOCK-T4', location: 'Recinto T-Rex', position: { x: 65, y: 30 }, isOnline: true, status: 'active', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-03', name: 'FIELD-ALPHA', location: 'Paddock Raptor', position: { x: 42, y: 58 }, isOnline: true, status: 'active', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-04', name: 'GATE-07', location: 'Gate Settore 7', position: { x: 55, y: 15 }, isOnline: true, status: 'active', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-05', name: 'NORTH-VALLEY', location: 'Valle Nord-Ovest', position: { x: 80, y: 75 }, isOnline: true, status: 'active', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
  { id: 'CAM-06', name: 'BIOSYN-SANCTUARY', location: 'Santuario BioSyn (Dall\'alto)', position: { x: 30, y: 85 }, isOnline: false, status: 'offline', imageUrl: 'https://images.unsplash.com/photo-1503387762-592dea58ef01?auto=format&fit=crop&q=80&w=800' },
];
const INITIAL_DINOS: Dinosaur[] = [
  { id: 'TREX-01', species: 'Tyrannosaurus Rex', threatLevel: 'Extreme', diet: 'Carnivore', status: 'Stable', enclosure: 'Sector 4', position: { x: 65, y: 30 } },
  { id: 'VEL-04', species: 'Velociraptor', threatLevel: 'High', diet: 'Carnivore', status: 'Breached', enclosure: 'S-Field Alpha', position: { x: 42, y: 58 } },
  { id: 'TRI-02', species: 'Triceratops', threatLevel: 'Low', diet: 'Herbivore', status: 'Stable', enclosure: 'Plains 1', position: { x: 20, y: 25 } },
  { id: 'BRA-01', species: 'Brachiosaurus', threatLevel: 'Low', diet: 'Herbivore', status: 'Stable', enclosure: 'Valley West', position: { x: 80, y: 75 } },
  { id: 'GIG-01', species: 'Giganotosaurus', threatLevel: 'Extreme', diet: 'Carnivore', status: 'Tracking', enclosure: 'Sector 7', position: { x: 55, y: 15 } },
  { id: 'STE-01', species: 'Stegosaurus', threatLevel: 'Medium', diet: 'Herbivore', status: 'Stable', enclosure: 'Plains 2', position: { x: 35, y: 35 } },
  { id: 'PAR-03', species: 'Parasaurolophus', threatLevel: 'Low', diet: 'Herbivore', status: 'Stable', enclosure: 'Lagoon Edge', position: { x: 30, y: 85 } },
];

const INITIAL_STAFF: Personnel[] = [
  { id: 'S-102', name: 'Dr. Henry Wu', role: 'Chief Geneticist', status: 'Enclosure B', active: true, details: 'Bio-signature stable. Current task: Genetic sequencing.', position: { x: 35, y: 45 } },
  { id: 'S-442', name: 'R. Grady', role: 'Field Specialist', status: 'Sector 4', active: false, details: 'SIGNAL LOST. Last known coordinates: Raptor Paddock.', position: { x: 45, y: 60 } },
  { id: 'S-205', name: 'C. Dodgson', role: 'CEO', status: 'Executive Wing', active: true, details: 'Securing satellite uplink. Authorized access level 10.', position: { x: 50, y: 50 } },
  { id: 'S-009', name: 'R. Muldoon', role: 'Security Lead', status: 'Sector 7', active: true, details: 'Patrolling sector perimeter. Weapon systems active.', position: { x: 55, y: 15 } },
  { id: 'S-112', name: 'Sarah Harding', role: 'Paleontologist', status: 'Sector 4', active: true, details: 'Observing nesting behavior. Minimal noise protocol.', position: { x: 42, y: 58 } },
  { id: 'S-088', name: 'Ellie Sattler', role: 'Paleobotanist', status: 'Greenhouse 1', active: true, details: 'Analyzing prehistoric flora variants.', position: { x: 25, y: 70 } },
  { id: 'S-077', name: 'Ian Malcolm', role: 'Consultant', status: 'Control Room', active: true, details: 'Discussing chaos theory implications on containment.', position: { x: 48, y: 48 } },
  { id: 'S-055', name: 'Alan Grant', role: 'Consultant', status: 'Sector Alpha', active: true, details: 'Field assessment of herbivore migration.', position: { x: 15, y: 25 } },
  { id: 'S-221', name: 'Maintenance-A', role: 'Technician', status: 'Tunnel 3', active: true, details: 'Repairing Hyperloop track lighting.', position: { x: 65, y: 40 } },
  { id: 'S-222', name: 'Security-B', role: 'Guard', status: 'Gate 7-A', active: true, details: 'Guarding high-risk perimeter.', position: { x: 53, y: 13 } },
];

const BREACH_POINTS = [
  { id: 'B1', x: 52, y: 12 },
  { id: 'B2', x: 41, y: 57 },
];

const INITIAL_LOGS: SecurityEvent[] = [
  { id: 'L-001', timestamp: '08:42:15', type: 'Alert', message: 'Perimeter Breach detected: Sector 7', location: 'Sector 7' },
  { id: 'L-002', timestamp: '08:15:00', type: 'Info', message: 'Feeding scheduled: Sector 4', location: 'Sector 4' },
  { id: 'L-003', timestamp: '07:30:22', type: 'Warning', message: 'Sensor malfunction: Enclosure B', location: 'Enclosure B' },
  { id: 'L-004', timestamp: '07:12:45', type: 'Info', message: 'Atmospheric pressure drop detected', location: 'Lab Wing' },
];

const POWER_COSTS: Record<string, number> = {
  'HQ': 35,
  'CONTROL': 15,
  'LAB': 20,
  'POST-A': 10,
  'POST-B': 10,
  'POST-C': 10,
  'POST-D': 10,
  'MINE': 15,
  'AIR': 15,
  'FOSSIL': 15,
  'CAFE': 5,
  'SEC-A': 2,
  'SEC-B': 2,
  'SEC-7': 2,
};

const MAX_POWER_CAPACITY = 105; // MW
const DINO_ENCLOSURES = ['Sector 4', 'S-Field Alpha', 'Plains 1', 'Valley West', 'Sector 7', 'Lagoon Edge'];
const PRIMARY_NODE_IDS = ['DAM', 'HQ', 'CONTROL', 'LAB', 'POST-A', 'POST-B', 'POST-C', 'SEC-A', 'SEC-B', 'SEC-7'];

export default function App() {
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [dinos, setDinos] = useState(INITIAL_DINOS);
  const [isLockdown, setIsLockdown] = useState(false);
  const [isPowerRerouted, setIsPowerRerouted] = useState(false);
  const [activePowerNodes, setActivePowerNodes] = useState<string[]>(['DAM', 'HQ', 'CONTROL', 'LAB', 'A', 'B', 'C', 'D', 'MINE', 'AIR', 'FOSSIL', 'SEC-A', 'SEC-B', 'SEC-7']);
  const [logs, setLogs] = useState<SecurityEvent[]>(INITIAL_LOGS);
  const [staff, setStaff] = useState<Personnel[]>(INITIAL_STAFF);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isHyperloopActive, setIsHyperloopActive] = useState(true);
  const [isADSActive, setIsADSActive] = useState(true);
  const [isNeuralActive, setIsNeuralActive] = useState(false);
  const [isEmergencyProtocol, setIsEmergencyProtocol] = useState(false);
  const [isPowerLossVisible, setIsPowerLossVisible] = useState(false);
  const [isSafetyProtocolActive, setIsSafetyProtocolActive] = useState(true);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);

  const onRepairCamera = (id: string) => {
    if (id === 'CAM-01' || id === 'CAM-06') return;
    setCameras(prev => prev.map(c => c.id === id ? { ...c, isOnline: true, status: 'active' } : c));
  };

  const isDamPowered = activePowerNodes.includes('DAM');

  // Safety Protocol Logic: Monitor staff in proximity to dinos or lost signal
  useEffect(() => {
    if (!isSafetyProtocolActive) return;

    const checkSafety = () => {
      staff.forEach(person => {
        const isSignalLost = person.status === 'Signal Lost' || person.details.includes('SIGNAL LOST');
        const isInEnclosure = DINO_ENCLOSURES.includes(person.status);

        if (isSignalLost || isInEnclosure) {
          // Check if we already logged this recently (within last 30 logs)
          const hasLogged = logs.slice(0, 30).some(l => l.message.includes(person.name) && l.message.includes('Personnel in Danger'));
          
          if (!hasLogged) {
            addLog(`Personale in Pericolo: ${person.name} rilevato presso ${person.status}`, 'Critical', person.status);
            speak(`Attenzione. Personale in pericolo. Posizione di ${person.name} compromessa.`);
            playSound('alert');
          }
        }
      });
    };

    const interval = setInterval(checkSafety, 8000);
    return () => clearInterval(interval);
  }, [staff, dinos, isSafetyProtocolActive, logs]);
  useEffect(() => {
    const roamingInterval = setInterval(() => {
      setDinos(prev => prev.map(dino => {
        let dx = 0;
        let dy = 0;

        if (isEmergencyProtocol) {
          const targetX = 50;
          const targetY = 55;
          dx = (targetX - dino.position.x) * 0.05;
          dy = (targetY - dino.position.y) * 0.05;
        } else if (isNeuralActive) {
          const speed = 0.2;
          dx = (Math.random() - 0.5) * speed;
          dy = (Math.random() - 0.5) * speed;
        } else {
          const speed = dino.status === 'Breached' ? 1.2 : 0.4;
          dx = (Math.random() - 0.5) * speed;
          dy = (Math.random() - 0.5) * speed;
        }
        
        const newX = Math.min(Math.max(dino.position.x + dx, 5), 95);
        const newY = Math.min(Math.max(dino.position.y + dy, 5), 95);
        
        // Power Damage Logic
        if (dino.status === 'Breached' && Math.random() < 0.05) {
          // Check proximity to key nodes (HQ: 50,55, Post-A: 10,35, etc.)
          const nodesOnMap = [
            { id: 'HQ', x: 50, y: 55 },
            { id: 'POST-A', x: 10, y: 35 },
            { id: 'POST-B', x: 70, y: 20 },
            { id: 'POST-C', x: 55, y: 65 },
            { id: 'MINE', x: 30, y: 80 },
          ];

          nodesOnMap.forEach(node => {
            const dist = Math.sqrt(Math.pow(newX - node.x, 2) + Math.pow(newY - node.y, 2));
            if (dist < 5) {
              setActivePowerNodes(prevNodes => {
                if (prevNodes.includes(node.id)) {
                  addLog(`CRITICO: ${dino.species} HA DANNEGGIATO L'ALIMENTATORE A ${node.id}`, 'Critical', 'Power Grid');
                  speak(`Attenzione. Guasto energetico al nodo ${node.id}. Attività animale rilevata sulle linee di distribuzione.`);
                  playSound('alert');
                  setIsPowerLossVisible(true);
                  return prevNodes.filter(id => id !== node.id);
                }
                return prevNodes;
              });
            }
          });
        }
        
        // Camera Damage Logic
        if (dino.status === 'Breached' && Math.random() < 0.08) {
          setCameras(prev => prev.map(cam => {
            const dist = Math.sqrt(Math.pow(newX - cam.position.x, 2) + Math.pow(newY - cam.position.y, 2));
            if (dist < 4 && cam.isOnline) {
              addLog(`CCTV OFFLINE: POSSIBILE DANNO ASSET A ${cam.id}`, 'Warning', cam.location);
              speak(`Attenzione. Perdita segnale video alla telecamera ${cam.id}. Possibile interferenza animale.`);
              playSound('alert');
              return { ...cam, isOnline: false, status: 'offline' };
            }
            return cam;
          }));
        }
        
        return { ...dino, position: { x: newX, y: newY } };
      }));
    }, 3000);
    return () => clearInterval(roamingInterval);
  }, [isEmergencyProtocol, isNeuralActive]);

  const toggleHyperloop = () => {
    const newState = !isHyperloopActive;
    setIsHyperloopActive(newState);
    addLog(
      newState ? 'SISTEMA HYPERLOOP RIATTIVATO' : 'SHUTDOWN EMERGENZA HYPERLOOP',
      newState ? 'Info' : 'Alert',
      'Transport'
    );
    playSound(newState ? 'success' : 'alert');
  };

  const togglePowerNode = (nodeId: string) => {
    if (isPowerRerouted && !PRIMARY_NODE_IDS.includes(nodeId)) {
      speak("Comando negato. Sistema in modalità carico ristretto. Impossibile alimentare strutture secondarie.");
      playSound('alert');
      return;
    }

    if (nodeId !== 'DAM' && !activePowerNodes.includes('DAM')) {
      speak("Fallimento accensione rete. Generatore principale scollegato. Ripristinare la connessione alla diga.");
      playSound('alert');
      return;
    }

    setActivePowerNodes(prev => {
      const active = prev.includes(nodeId);
      
      // Special logic for DAM source
      if (nodeId === 'DAM' && active) {
        speak("Blackout. Sorgente energetica primaria scollegata. Fallimento totale del contenimento imminente.");
        addLog('COLLASSO TOTALE RETE: GENERATORE PRIMARIO OFFLINE', 'Critical', 'Source');
        playSound('alert');
        setIsPowerLossVisible(true);
        return []; // Blackout: all nodes lose power
      }

      let nextNodes = active ? prev.filter(id => id !== nodeId) : [...prev, nodeId];
      
      // Calculate total load
      const calculateLoad = (nodes: string[]) => nodes.reduce((acc, id) => acc + (POWER_COSTS[id] || 0), 0);
      let totalLoad = calculateLoad(nextNodes);

      if (!active && totalLoad > MAX_POWER_CAPACITY) {
        // Power Loss Logic: Shed non-essential nodes
        addLog('SOVRACCARICO RETE: INIZIATO DISTACCO AUTOMATICO CARICHI', 'Critical', 'Power');
        speak("Attenzione. Carico energetico eccessivo. Inizio distacco di sicurezza delle strutture non primarie.");
        playSound('alert');
        setIsPowerLossVisible(true);
        
        // Priority: Filter out SEC and POST nodes until load is safe
        const secondary = nextNodes.filter(id => !['HQ', 'CONTROL', 'LAB', 'DAM'].includes(id) && id !== nodeId);
        for (const shedId of secondary) {
          nextNodes = nextNodes.filter(id => id !== shedId);
          totalLoad = calculateLoad(nextNodes);
          if (totalLoad <= MAX_POWER_CAPACITY) break;
        }
      }

      addLog(
        `${active ? 'DISCONNESSO' : 'CONNESSO'} nodo energetico: ${nodeId}`,
        active ? 'Warning' : 'Info',
        'Power Grid'
      );
      playSound(active ? 'alert' : 'success');
      return nextNodes;
    });
  };

  const togglePowerReroute = () => {
    const newState = !isPowerRerouted;
    setIsPowerRerouted(newState);
    
    if (newState) {
      // Force disable all non-primary nodes
      setActivePowerNodes(prev => prev.filter(id => PRIMARY_NODE_IDS.includes(id)));
      speak("Energia di emergenza reindirizzata ai settori primari. Reti non essenziali disattivate.");
    } else {
      speak("Ripristino energetico completato. Rete in ritorno al carico standard.");
    }

    addLog(
      newState ? 'ENERGIA REINDIRIZZATA AL CONTENIMENTO PRIMARIO' : 'SISTEMA TORNATO A RETE BILANCIATA',
      'Warning',
      'Power'
    );
    playSound('alert');
  };

  const handleLocateOnMap = (id: string) => {
    setFocusedId(id);
    setActiveApp(AppId.RADAR);
    playSound('tap');
  };

  const addLog = (message: string, type: SecurityEvent['type'] = 'Info', location: string = 'System') => {
    const newLog: SecurityEvent = {
      id: `L-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      type,
      message,
      location
    };
    setLogs(prev => [newLog, ...prev]);
    if (type === 'Alert' || type === 'Warning') playSound('alert');
  };

  // Procedural Sound Engine
  const playSound = (type: 'tap' | 'alert' | 'success' | 'lockdown') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.15);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'lockdown') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
       console.warn('Audio not available');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find a "natural" sounding voice
      // Prioritize Italian "Natural" or "Google" voices
      const voice = voices.find(v => v.lang.startsWith('it') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Elsa'))) || 
                    voices.find(v => v.lang.startsWith('it')) ||
                    voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices[0];
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      
      utterance.pitch = 0.95;
      utterance.rate = 1.0;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLockdown = () => {
    const newState = !isLockdown;
    setIsLockdown(newState);
    playSound('lockdown');
    
    if (newState) {
      speak("Protocollo di isolamento avviato. Perimetri di sicurezza sigillati. Collegamenti ADS e Neurali disattivati per prevenire interferenze.");
      setIsADSActive(false);
      setIsNeuralActive(false);
      addLog('SISTEMI ADS E NEURALI DISATTIVATI', 'Warning', 'Security');
    } else {
      speak("Isolamento terminato. Sistema in ritorno alla modalità standby.");
    }
    
    addLog(
      newState ? 'PROTOCOLLO LOCKDOWN AVVIATO' : 'PROTOCOLLO LOCKDOWN TERMINATO',
      newState ? 'Alert' : 'Warning',
      'Global'
    );
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate breaching alert
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setIsAlertActive(true);
      speak("Attenzione. Violazione del contenimento rilevata nel settore sette B.");
      playSound('alert');
    }, 5000);
    return () => clearTimeout(alertTimer);
  }, []);

  const closeApp = () => {
    playSound('tap');
    setActiveApp(null);
  };

  const handleAlertClick = () => {
    playSound('tap');
    setActiveApp(AppId.RADAR);
    setIsAlertActive(false);
    if (!isLockdown) toggleLockdown();
  };

  const updateDinoStatus = (id: string, newStatus: string) => {
    playSound('tap');
    setDinos(prev => prev.map(d => d.id === id ? { ...d, status: newStatus as any } : d));
    addLog(`Aggiornamento stato Asset ${id}: ${newStatus}`, 'Info', 'Radar');
  };

  const launchApp = (id: AppId) => {
    playSound('tap');
    setActiveApp(id);
  };

  const toggleADS = () => {
    if (isEmergencyProtocol || isLockdown) {
      playSound('tap');
      addLog(`OVERRIDE ADS BLOCCATO: Protocollo ${isLockdown ? 'Lockdown' : 'Emergenza'} Attivo`, 'Alert', 'Security');
      return;
    }
    const newState = !isADSActive;
    setIsADSActive(newState);
    addLog(newState ? 'SISTEMA ADS RIPRISTINATO' : 'GUASTO DISCO SISTEMA ADS / OFFLINE', newState ? 'Info' : 'Alert', 'Security');
    if (!newState) speak("Attenzione. Sistema di Difesa Aerea disattivato. Contenimento Pterosauri a rischio.");
    else speak("ADS online. Corridoi di volo sicuri stabiliti.");
  };

  const toggleNeural = () => {
    if (isEmergencyProtocol || isLockdown) {
      playSound('tap');
      addLog(`OVERRIDE NEURALE BLOCCATO: Protocollo ${isLockdown ? 'Lockdown' : 'Emergenza'} Attivo`, 'Alert', 'Research');
      return;
    }
    const newState = !isNeuralActive;
    setIsNeuralActive(newState);
    addLog(newState ? 'UPLINK NEURALE STABILITO' : 'UPLINK NEURALE TERMINATO', 'Info', 'Research');
    if (newState) speak("Array sensori neurali attivo. Guida diretta degli asset abilitata.");
  };

  const toggleEmergencyProtocol = () => {
    const newState = !isEmergencyProtocol;
    setIsEmergencyProtocol(newState);
    if (newState) {
      setIsLockdown(true);
      setIsADSActive(false);
      setIsNeuralActive(false);
      setIsAlertActive(true);
      speak("Allerta Rossa di emergenza. Protocollo Codice Ambra. Richiamo di tutti gli asset al centro di contenimento.");
      addLog('PROTOCOLLO EMERGENZA AMBRA: RICHIAMO AVVIATO', 'Critical', 'Global');
    } else {
      speak("Protocollo di emergenza terminato. Ripresa del monitoraggio standard.");
    }
  };

  return (
    <div className="relative h-screen w-full bg-biosyn-charcoal flex items-center justify-center p-4">
      {/* Subtle Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none biosyn-vignette z-40" />

      {/* OS Container - Responsive Tablet/Mobile Shell */}
      <div className={`relative h-[90vh] max-h-[1100px] min-h-[600px] w-[95vw] max-w-[420px] md:max-w-[900px] lg:max-w-[1100px] bg-biosyn-charcoal rounded-[2rem] md:rounded-[3rem] border-[8px] md:border-[12px] shadow-2xl overflow-hidden flex flex-col transition-all duration-700 ${isLockdown ? 'border-biosyn-alert/40' : 'border-biosyn-border'}`}>
        
        {/* Screen Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className={`biosyn-topo-grid absolute inset-0 transition-opacity duration-1000 ${isLockdown ? 'opacity-20 hue-rotate-[320deg]' : 'opacity-10'}`} />
          <div className="biosyn-grid absolute inset-0 opacity-5" />
          
          {/* Faint Biosyn Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none scale-150">
             <svg viewBox="0 0 100 100" className="w-64 h-64 fill-white">
                <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 20 L76 35 L76 65 L50 80 L24 65 L24 35 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 40 L58.7 45 L58.7 55 L50 60 L41.3 55 L41.3 45 Z" fill="currentColor" />
             </svg>
          </div>
        </div>

        <AnimatePresence>
          {isAlertActive && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleAlertClick}
              className="absolute inset-0 z-50 cursor-pointer"
            >
              <div className="absolute inset-0 border-[20px] border-biosyn-alert alert-pulse pointer-events-none" />
              <div className="absolute top-12 left-2 right-2 p-4 bg-biosyn-alert/90 backdrop-blur-md border border-biosyn-alert text-white flex items-center gap-3 shadow-2xl rounded-xl active:scale-95 transition-transform">
                <AlertTriangle className="text-white animate-pulse" />
                <div className="flex-1">
                  <div className="font-bold uppercase tracking-widest text-[10px]">Violazione Contenimento</div>
                  <div className="text-[9px] opacity-90 leading-tight">Settore 7B: Esemplare di Giganotosaurus in movimento verso i tunnel di manutenzione.</div>
                </div>
                <div className="text-[8px] font-bold bg-white/20 px-2 py-1 rounded">INTERVIENI</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Power Loss Alert Overlay */}
        <AnimatePresence>
          {isPowerLossVisible && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black border border-biosyn-alert p-6 text-center space-y-4 shadow-[0_0_30px_rgba(197,48,48,0.3)]"
              >
                <div className="flex justify-center">
                  <ZapOff size={32} className="text-biosyn-alert animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-black uppercase tracking-widest text-biosyn-alert italic">Evento Energetico Critico</h2>
                  <p className="text-[8px] text-white/50 font-mono uppercase tracking-widest leading-relaxed">
                    Sovraccarico rete o danni ai feeder rilevati. Sottosistemi non primari distaccati.
                  </p>
                </div>
                <button 
                  onClick={() => { setIsPowerLossVisible(false); playSound('success'); }}
                  className="w-full py-2 bg-biosyn-alert text-black font-bold uppercase tracking-widest text-[8px] hover:bg-red-500 transition-colors"
                >
                  Conferma Ricezione
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <div className="relative z-10 flex justify-between items-center px-8 pt-4 pb-2 text-[9px] font-bold tracking-widest uppercase bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-biosyn-amber">BIOSYN SECURE-LINK</span>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <Wifi size={10} />
            <Signal size={10} />
            <div className="flex items-center gap-1">
               <span>84%</span>
               <div className="w-5 h-2.5 border border-white/40 rounded-sm p-[1px]">
                  <div className="bg-white/80 h-full w-[84%]" />
               </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!activeApp ? (
              <HomeScreen onLaunch={launchApp} isDamPowered={isDamPowered} />
            ) : (
                <AppWindow 
                  appId={activeApp} 
                  onClose={closeApp} 
                  dinos={dinos} 
                  logs={logs}
                  staff={staff}
                  focusedId={focusedId}
                  isLockdown={isLockdown}
                  isPowerRerouted={isPowerRerouted}
                  activePowerNodes={activePowerNodes}
                  isHyperloopActive={isHyperloopActive}
                  onToggleLockdown={toggleLockdown}
                  onTogglePower={togglePowerReroute}
                  onTogglePowerNode={togglePowerNode}
                  onToggleHyperloop={toggleHyperloop}
                  onSwitchApp={launchApp}
                  onUpdateDino={updateDinoStatus}
                  onAddLog={addLog}
                  onPlaySound={playSound}
                  onLocate={handleLocateOnMap}
                  isADSActive={isADSActive}
                  isNeuralActive={isNeuralActive}
                  isEmergencyProtocol={isEmergencyProtocol}
                  onToggleADS={toggleADS}
                  onToggleNeural={toggleNeural}
                  onToggleEmergencyProtocol={toggleEmergencyProtocol}
                  isSafetyActive={isSafetyProtocolActive}
                  onToggleSafety={() => setIsSafetyProtocolActive(!isSafetyProtocolActive)}
                  isDamPowered={activePowerNodes.includes('DAM')}
                  cameras={cameras}
                  onRepairCamera={onRepairCamera}
                />
            )}
          </AnimatePresence>
        </div>

        {/* Home/Gesture Bar */}
        <button 
          onClick={closeApp}
          className="relative z-10 p-4 w-full flex justify-center group outline-none active:scale-90 transition-transform"
        >
            <div className="w-32 h-1 bg-white/20 rounded-full mb-1 group-hover:bg-white/40 transition-colors" />
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onLaunch, isDamPowered }: { onLaunch: (id: AppId) => void, isDamPowered: boolean }) {
  const apps = [
    { id: AppId.COMMS, name: 'Comms', icon: MessageSquare, active: false },
    { id: AppId.LOGS, name: 'Security', icon: ClipboardList, active: false },
    { id: AppId.RADAR, name: 'Radar', icon: RadarIcon, active: true },
    { id: AppId.PERSONNEL, name: 'Personnel', icon: Users, active: false },
    { id: AppId.ENVIRONMENT, name: 'Files', icon: ClipboardList, active: false },
    { id: AppId.SURVEILLANCE, name: 'CCTV', icon: Video, active: true },
    { id: AppId.POWER, name: 'Power', icon: Zap, active: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-full w-full p-8 flex flex-col relative"
    >
      {!isDamPowered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm pointer-events-none flex flex-col items-center justify-center gap-2 border border-biosyn-alert/20 m-4 rounded-3xl"
        >
          <ZapOff size={32} className="text-biosyn-alert animate-bounce" />
          <span className="text-[10px] font-black text-biosyn-alert uppercase tracking-widest">Collasso Rete</span>
          <span className="text-[6px] text-white/40 uppercase font-bold">Richiesto override manuale</span>
        </motion.div>
      )}

      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 bg-biosyn-green rounded flex items-center justify-center">
           <span className="text-[28px] font-black text-black/50">B</span>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-widest text-biosyn-amber uppercase">BioSyn Genetics</h1>
          <p className="text-[9px] opacity-50 uppercase tracking-tight">Valley Operations OS v4.2.1</p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 md:gap-x-12 md:gap-y-16">
        {apps.map((app) => (
          <button
            key={app.id}
            id={`app-${app.id}`}
            onClick={() => onLaunch(app.id)}
            className="flex flex-col items-center gap-2 group outline-none active:scale-95 transition-transform"
          >
            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-200 border ${
              app.active 
                ? 'bg-biosyn-amber text-black border-black/20 shadow-[0_0_15px_rgba(255,179,0,0.4)]' 
                : 'bg-biosyn-border text-biosyn-text border-white/5 hover:bg-biosyn-green hover:border-biosyn-green/40'
            }`}>
              <app.icon size={24} className="md:w-8 md:h-8" />
            </div>
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{app.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pb-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-4 flex justify-around border border-biosyn-border shadow-2xl">
             <MessageSquare size={20} className="text-biosyn-text/40" />
             <RadarIcon size={20} className="text-biosyn-amber shadow-[0_0_8px_rgba(255,179,0,0.4)]" />
             <ClipboardList size={20} className="text-biosyn-text/40" />
        </div>
      </div>
    </motion.div>
  );
}

function AppWindow({ appId, onClose, dinos, logs, staff, focusedId, isLockdown, isPowerRerouted, activePowerNodes, isHyperloopActive, isADSActive, isNeuralActive, isEmergencyProtocol, onToggleLockdown, onTogglePower, onTogglePowerNode, onToggleHyperloop, onToggleADS, onToggleNeural, onToggleEmergencyProtocol, onSwitchApp, onUpdateDino, onAddLog, onPlaySound, onLocate, isSafetyActive, onToggleSafety, isDamPowered, cameras, onRepairCamera }: { 
  appId: AppId, 
  onClose: () => void, 
  dinos: Dinosaur[],
  logs: SecurityEvent[],
  staff: Personnel[],
  focusedId: string | null,
  isLockdown: boolean,
  isPowerRerouted: boolean,
  activePowerNodes: string[],
  isHyperloopActive: boolean,
  isADSActive: boolean,
  isNeuralActive: boolean,
  isEmergencyProtocol: boolean,
  onToggleLockdown: () => void,
  onTogglePower: () => void,
  onTogglePowerNode: (id: string) => void,
  onToggleHyperloop: () => void,
  onToggleADS: () => void,
  onToggleNeural: () => void,
  onToggleEmergencyProtocol: () => void,
  onSwitchApp: (id: AppId) => void,
  onUpdateDino: (id: string, status: string) => void,
  onAddLog: (msg: string, type?: SecurityEvent['type'], loc?: string) => void,
  onPlaySound: (type: 'tap' | 'alert' | 'success' | 'lockdown') => void,
  onLocate: (id: string) => void,
  isSafetyActive: boolean,
  onToggleSafety: () => void,
  isDamPowered: boolean,
  cameras: Camera[],
  onRepairCamera: (id: string) => void
}) {
  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 350 }}
      className={`absolute inset-0 flex flex-col z-20 ${isLockdown ? 'bg-[#1A0505]' : 'bg-biosyn-charcoal'}`}
    >
      {/* Global Application Blackout Overlay */}
      {!isDamPowered && appId !== AppId.POWER && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center gap-4 border border-biosyn-alert/20 m-2 rounded-2xl"
        >
          <div className="relative">
            <ZapOff size={48} className="text-biosyn-alert animate-pulse" />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -inset-4 border border-biosyn-alert/30 rounded-full"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-[0.3em] text-biosyn-alert">Sistema Offline</h2>
            <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest leading-relaxed max-w-[200px]">
              Guasto Energetico Critico: Generatore Principale (DAM) Scollegato. Risorse applicative sospese.
            </p>
          </div>
          <div className="w-full max-w-[150px] space-y-2 mt-4">
             <div className="h-0.5 bg-white/5 w-full relative overflow-hidden">
                <motion.div 
                   animate={{ x: [-150, 150] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="absolute inset-y-0 w-20 bg-biosyn-alert"
                />
             </div>
             <div className="text-[7px] text-biosyn-alert font-bold uppercase tracking-tighter animate-pulse">Tentativo di riaccensione...</div>
          </div>

          <button 
            onClick={onClose}
            className="mt-6 px-4 py-2 border border-biosyn-alert/40 text-biosyn-alert text-[8px] font-black uppercase tracking-widest hover:bg-biosyn-alert hover:text-black transition-all"
          >
            Ritorno Terminale: Dashboard
          </button>
        </motion.div>
      )}

      <div className={`relative z-[110] px-6 py-4 flex items-center gap-4 border-b bg-black/40 backdrop-blur-xl transition-colors ${isLockdown ? 'border-biosyn-alert/30' : 'border-biosyn-border'}`}>
        <button id="back-btn" onClick={onClose} className="p-2 -ml-2 rounded-full active:bg-white/5 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest uppercase">{appId.replace('_', ' ')}</span>
          {isLockdown && <span className="text-[6px] text-biosyn-alert font-bold animate-pulse">EMERGENCY OVERRIDE ACTIVE</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {appId === AppId.RADAR && (
          <RadarApp 
            dinos={dinos} 
            staff={staff}
            focusedId={focusedId}
            isLockdown={isLockdown}
            isPowerRerouted={isPowerRerouted}
            activePowerNodes={activePowerNodes}
            isHyperloopActive={isHyperloopActive}
            onToggleLockdown={onToggleLockdown}
            onTogglePower={onTogglePower}
            onTogglePowerNode={onTogglePowerNode}
            onToggleHyperloop={onToggleHyperloop}
            onUpdateStatus={onUpdateDino} 
            onOpenLogs={() => onSwitchApp(AppId.LOGS)} 
            onAddLog={onAddLog}
            onPlaySound={onPlaySound}
            isADSActive={isADSActive}
            isNeuralActive={isNeuralActive}
            onToggleADS={onToggleADS}
            onToggleNeural={onToggleNeural}
            isEmergencyProtocol={isEmergencyProtocol}
            onToggleEmergencyProtocol={onToggleEmergencyProtocol}
          />
        )}
        {appId === AppId.SURVEILLANCE && (
          <SurveillanceApp 
            cameras={cameras}
            isDamPowered={isDamPowered}
            onRepair={onRepairCamera}
            onPlaySound={onPlaySound}
          />
        )}
        {appId === AppId.POWER && (
          <PowerApp 
            activePowerNodes={activePowerNodes}
            isPowerRerouted={isPowerRerouted}
            onTogglePowerNode={onTogglePowerNode}
            onTogglePower={onTogglePower}
            onPlaySound={onPlaySound}
          />
        )}
        {appId === AppId.LOGS && <LogsApp logs={logs} />}
        {appId === AppId.COMMS && <CommsApp onPlaySound={onPlaySound} />}
        {appId === AppId.PERSONNEL && <PersonnelApp staff={staff} onPlaySound={onPlaySound} onLocate={onLocate} isSafetyActive={isSafetyActive} onToggleSafety={onToggleSafety} />}
        {appId === AppId.ENVIRONMENT && <EnvironmentApp />}
      </div>
    </motion.div>
  );
}

function EnvironmentApp() {
  return (
    <div className="p-6 space-y-6 bg-biosyn-surface h-full">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="text-biosyn-amber" size={18} />
        <h2 className="text-xs font-bold uppercase tracking-widest">Environmental Status</h2>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Ambient Temp', value: '28.4°C', color: 'text-biosyn-text' },
          { label: 'Humidity', value: '72%', color: 'text-biosyn-text' },
          { label: 'Pressure', value: '1012 hPa', color: 'text-biosyn-text' },
          { label: 'Precipitation', value: '12%', color: 'text-biosyn-text' },
          { label: 'Seismic', value: '0.22', color: 'text-biosyn-green' },
          { label: 'Wind', value: '8 km/h', color: 'text-biosyn-text' },
        ].map((stat, i) => (
          <div key={i} className="bg-black/20 border border-biosyn-border p-3 md:p-5 rounded">
            <span className="text-[8px] md:text-[10px] uppercase opacity-40 block mb-1">{stat.label}</span>
            <span className={`text-base md:text-xl font-mono font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black/40 border border-biosyn-border rounded-lg">
        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-3 text-biosyn-amber">Atmospheric Trends</h3>
        <div className="h-24 flex items-end gap-1">
          {[40, 60, 45, 70, 85, 65, 50, 45, 60, 75, 90, 80].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              className="flex-1 bg-biosyn-amber/20 border-t border-biosyn-amber/40 min-w-[2px]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RadarApp({ dinos, staff, focusedId, isLockdown, isPowerRerouted, activePowerNodes, isHyperloopActive, isADSActive, isNeuralActive, isEmergencyProtocol, onToggleLockdown, onTogglePower, onTogglePowerNode, onToggleHyperloop, onToggleADS, onToggleNeural, onToggleEmergencyProtocol, onUpdateStatus, onOpenLogs, onAddLog, onPlaySound }: { 
  dinos: Dinosaur[],
  staff: Personnel[],
  focusedId: string | null,
  isLockdown: boolean,
  isPowerRerouted: boolean,
  activePowerNodes: string[],
  isHyperloopActive: boolean,
  isADSActive: boolean,
  isNeuralActive: boolean,
  isEmergencyProtocol: boolean,
  onToggleLockdown: () => void,
  onTogglePower: () => void,
  onTogglePowerNode: (id: string) => void,
  onToggleHyperloop: () => void,
  onToggleADS: () => void,
  onToggleNeural: () => void,
  onToggleEmergencyProtocol: () => void,
  onUpdateStatus: (id: string, status: string) => void,
  onOpenLogs: () => void,
  onAddLog: (msg: string, type?: SecurityEvent['type'], loc?: string) => void,
  onPlaySound: (type: 'tap' | 'alert' | 'success' | 'lockdown') => void
}) {
  const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Personnel | null>(null);
  const [viewMode, setViewMode] = useState<'MAP' | 'DATABASE'>('MAP');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (focusedId) {
      const dino = dinos.find(d => d.id === focusedId);
      if (dino) {
        setSelectedDino(dino);
        setZoom(1.8);
        setOffset({ x: (50 - dino.position.x) * 2, y: (50 - dino.position.y) * 2 });
      }
      const person = staff.find(p => p.id === focusedId);
      if (person && person.position) {
        setSelectedStaff(person);
        setZoom(1.8);
        setOffset({ x: (50 - person.position.x) * 2, y: (50 - person.position.y) * 2 });
      }
    }
  }, [focusedId, dinos, staff]);

  const handleZoom = (delta: number) => {
    onPlaySound('tap');
    setZoom(prev => Math.min(Math.max(prev + delta, 1), 3));
    if (zoom + delta <= 1) setOffset({ x: 0, y: 0 });
  };

  const handleTag = () => {
    if (!selectedDino) return;
    const nextStatus = selectedDino.status === 'Breached' ? 'Tracking' : 'Stable';
    onUpdateStatus(selectedDino.id, nextStatus);
    setSelectedDino({ ...selectedDino, status: nextStatus as any });
  };

  const executeEmergency = (action: string) => {
    onPlaySound('alert');
    onAddLog(`EMERGENCY: ${action} executed`, 'Alert', 'Global');
  };

  const handleMarkerClick = (dino: Dinosaur) => {
    onPlaySound('tap');
    setSelectedDino(dino);
    setSelectedStaff(null);
  };

  return (
    <div className={`h-full flex flex-col relative transition-colors duration-500 ${isLockdown ? 'bg-[#150202]' : 'bg-[#080a08]'}`}>
      {/* Blackout Overlay */}
      {!activePowerNodes.includes('DAM') && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center border border-biosyn-alert/40 m-2 rounded-xl"
        >
          <div className="p-8 border border-biosyn-alert bg-black flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(197,48,48,0.2)]">
            <Radio size={48} className="text-biosyn-alert animate-pulse" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-biosyn-alert">Signal Lost</h2>
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Secondary Radar Array: Offline • Backup Power: Depleted</p>
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
              <motion.div 
                animate={{ x: [-100, 200] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-24 h-full bg-biosyn-alert opacity-40 shadow-[0_0_10px_#C53030]"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* View Toggle & Zoom Controls */}
      <div className="absolute top-4 left-4 right-4 z-40 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pointer-events-none">
        <div className="flex bg-black/80 backdrop-blur-md rounded border border-biosyn-border p-1 pointer-events-auto shadow-2xl">
          <button onClick={() => handleZoom(0.4)} className="px-2 py-1 text-white hover:text-biosyn-amber border-r border-white/10 uppercase text-[8px] font-bold">Zoom+</button>
          <button onClick={() => handleZoom(-0.4)} className="px-2 py-1 text-white hover:text-biosyn-amber uppercase text-[8px] font-bold">Zoom-</button>
        </div>

        <div className="flex bg-black/60 backdrop-blur-md rounded-md p-1 border border-biosyn-border pointer-events-auto shadow-2xl gap-2">
          <button 
            onClick={onToggleLockdown}
            className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-biosyn-alert/30 rounded transition-colors ${isLockdown ? 'bg-biosyn-alert text-white animate-pulse' : 'text-biosyn-alert/60'}`}
          >
            {isLockdown ? 'Lockdown Active' : 'Lockdown Mode'}
          </button>
          <button 
            onClick={onToggleEmergencyProtocol}
            className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-biosyn-alert/30 rounded transition-colors ${isEmergencyProtocol ? 'bg-biosyn-alert text-white animate-pulse' : 'text-biosyn-alert/60'}`}
          >
            {isEmergencyProtocol ? 'Cancel Red Alert' : 'Red Alert'}
          </button>
          <div className="w-px h-4 bg-white/10 self-center" />
          <button 
            onClick={() => { onPlaySound('tap'); setViewMode('MAP'); }}
            className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest transition-colors ${viewMode === 'MAP' ? 'bg-biosyn-amber text-black' : 'text-white/40'}`}
          >
            Map
          </button>
          <button 
            onClick={() => { onPlaySound('tap'); setViewMode('DATABASE'); }}
            className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest transition-colors ${viewMode === 'DATABASE' ? 'bg-biosyn-amber text-black' : 'text-white/40'}`}
          >
            Asset Info
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'MAP' ? (
          <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Interactive Map */}
            <div className="relative h-3/5 md:h-full md:flex-[2] bg-biosyn-green/5 overflow-hidden border-b md:border-b-0 md:border-r border-biosyn-border cursor-move">
              {/* Scan Line */}
              <motion.div 
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className={`absolute left-0 right-0 h-1 blur-[1px] z-10 pointer-events-none ${isLockdown ? 'bg-biosyn-alert/30' : 'bg-biosyn-amber/10'}`}
              />
              
              <div className={`absolute inset-0 biosyn-grid transition-opacity ${isLockdown ? 'opacity-10' : 'opacity-5'}`} />
              
              {/* Coordinate Markers */}
              <div className="absolute top-2 left-2 text-[6px] font-mono opacity-40 flex flex-col leading-none z-30">
                <span className={isLockdown ? 'text-biosyn-alert' : 'text-biosyn-amber'}>LAT: 44.5822° N</span>
                <span className={isLockdown ? 'text-biosyn-alert' : 'text-biosyn-amber'}>LNG: 10.4281° E</span>
                <span className="mt-1">SIGNAL: {isLockdown ? 'CRITICAL' : 'ENCRYPTED'}</span>
              </div>

              {/* Map Canvas with Zoom & Pan */}
              <motion.div
                drag
                dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                animate={{ scale: zoom, x: offset.x, y: offset.y }}
                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                onDoubleClick={() => handleZoom(0.5)}
                className="w-full h-full relative"
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   {/* Power Grid Lines - Source is THE DAM (440, 340) */}
                   <g className="transition-opacity duration-700">
                      {[
                        { id: 'HQ', x: 200, y: 220 },
                        { id: 'POST-A', x: 50, y: 154 },
                        { id: 'POST-B', x: 349, y: 99 },
                        { id: 'POST-C', x: 249, y: 349 },
                        { id: 'POST-D', x: 404, y: 424 },
                        { id: 'MINE', x: 154, y: 384 },
                        { id: 'AIR', x: 424, y: 54 },
                        { id: 'FOSSIL', x: 104, y: 64 },
                      ].map(node => {
                        const isPrimary = ['HQ', 'POST-A', 'POST-B', 'POST-C', 'SEC-A', 'SEC-B', 'SEC-7'].includes(node.id);
                        const isPowered = activePowerNodes.includes('DAM') && activePowerNodes.includes(node.id);
                        const powerLost = isPowerRerouted && !isPrimary;
                        const hasFlow = isPowered && !powerLost;
                        
                        return (
                          <motion.line 
                            key={`pwr-${node.id}`}
                            x1="440" y1="340" x2={node.x} y2={node.y}
                            stroke={hasFlow ? (isPowerRerouted ? '#F7C056' : '#556655') : '#111'}
                            strokeWidth={isPrimary ? "1" : "0.5"}
                            strokeDasharray={hasFlow ? "4 2" : "none"}
                            className={hasFlow && isPowerRerouted ? "animate-pulse" : ""}
                          />
                        );
                      })}
                   </g>

                   {/* Hyperloop (Connecting HQ to all points) */}
                   <g className="cursor-pointer">
                      <motion.path 
                        d="M 200 220 L 50 150 M 200 220 L 350 100 M 200 220 L 250 350 M 200 220 L 420 50 M 200 220 L 150 380 M 200 220 L 100 60" 
                        stroke={isHyperloopActive ? (isLockdown ? "#FF5555" : "#F7C056") : "#1a1a1a"} 
                        strokeWidth="1.5" fill="none"
                        strokeDasharray={isHyperloopActive ? "4 8" : "none"}
                        animate={isHyperloopActive ? { strokeDashoffset: [0, -12] } : {}}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                   </g>

                   {/* BioSyn HQ Ring Facility */}
                   <g className="opacity-80">
                      <motion.path 
                        onClick={(e) => { e.stopPropagation(); onTogglePowerNode('HQ'); }}
                        d="M 180 220 A 40 40 0 1 1 220 220" 
                        fill="none" 
                        stroke={activePowerNodes.includes('HQ') ? (isLockdown ? "#C53030" : "#3E4D3E") : "#111"} 
                        strokeWidth="15" 
                        strokeLinecap="round"
                        className="cursor-pointer"
                      />
                      <circle cx="200" cy="220" r="28" fill="none" stroke={activePowerNodes.includes('HQ') ? "#3E4D3E" : "#111"} strokeWidth="1" strokeDasharray="3 3" />
                      
                      {/* Internal Sub-Structures (Rooms) */}
                      <rect x="185" y="195" width="30" height="10" fill={activePowerNodes.includes('LAB') ? "#F7C056" : "#222"} opacity="0.4" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onTogglePowerNode('LAB'); }} />
                      <text x="187" y="202" fill="white" fontSize="3px">HABITAT LAB</text>
                      
                      <rect x="195" y="235" width="20" height="4" fill={activePowerNodes.includes('CAFE') ? "#3E4D3E" : "#111"} opacity="0.3" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onTogglePowerNode('CAFE'); }} />
                      <text x="197" y="238" fill="white" fontSize="2px">CAFE LAB</text>

                      <circle cx="200" cy="220" r="6" fill={activePowerNodes.includes('CONTROL') ? "#F7C056" : "#111"} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onTogglePowerNode('CONTROL'); }} />
                      <text x="194" y="218" fill="black" fontSize="2px" fontWeight="bold">CMD</text>
                   </g>

                   {/* Landmark Structures */}
                   <g className="opacity-90">
                      {[
                        { id: 'DAM', x: 440, y: 340, name: 'HYDRO-DAM', size: 10, type: 'gen' },
                        { id: 'MINE', x: 150, y: 380, name: 'AMBER MINES', size: 8, type: 'danger' },
                        { id: 'AIR', x: 420, y: 50, name: 'AERODROMO', size: 10, type: 'trans' },
                        { id: 'FOSSIL', x: 100, y: 60, name: 'FOSSIL CTR', size: 8, type: 'research' },
                        { id: 'POST-A', x: 50, y: 150, name: 'OUTPOST-A', size: 4, type: 'radar' },
                        { id: 'POST-B', x: 345, y: 95, name: 'OUTPOST-B', size: 4, type: 'radar' },
                        { id: 'POST-C', x: 245, y: 345, name: 'OUTPOST-C', size: 4, type: 'radar' },
                        { id: 'POST-D', x: 400, y: 420, name: 'OUTPOST-D', size: 4, type: 'radar' },
                      ].map(node => {
                        const isPrimary = ['DAM', 'HQ', 'CONTROL', 'LAB', 'POST-A', 'POST-B', 'POST-C'].includes(node.id);
                        const isDown = !activePowerNodes.includes(node.id) || (isPowerRerouted && !isPrimary);
                        
                        return (
                          <g key={node.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onTogglePowerNode(node.id); }}>
                            <rect 
                              x={node.x} y={node.y} width={node.size} height={node.size} 
                              fill={isDown ? "#C53030" : "#3E4D3E"} 
                              opacity={isDown ? 0.3 : 1}
                              className={!isDown && isPowerRerouted ? "animate-pulse" : ""}
                            />
                            <text x={node.x - 5} y={node.y - 5} fill={isDown ? "#C53030" : "#3E4D3E"} fontSize="3px" fontWeight="bold">{node.name}</text>
                            {isDown && <text x={node.x} y={node.y + node.size + 4} fill="#C53030" fontSize="2px">OFFLINE</text>}
                          </g>
                        );
                      })}
                   </g>

                   {/* Sector Management */}
                   <g>
                   <motion.path 
                    d="M50 150 L180 120 L220 250 L80 300 Z" 
                    fill={isNeuralActive ? "rgba(247,192,86,0.05)" : "none"} 
                    stroke={activePowerNodes.includes('SEC-A') ? (isNeuralActive ? "#F7C056" : "#3E4D3E") : "#C53030"} 
                    strokeWidth="1" strokeDasharray={activePowerNodes.includes('SEC-A') ? (isNeuralActive ? "none" : "2 1") : "4 4"}
                   />
                   <motion.path 
                    d="M220 250 L380 200 L400 350 L250 380 Z" 
                    fill={isNeuralActive ? "rgba(247,192,86,0.05)" : "none"} 
                    stroke={activePowerNodes.includes('SEC-B') ? (isNeuralActive ? "#F7C056" : "#3E4D3E") : "#C53030"} 
                    strokeWidth="1" strokeDasharray={activePowerNodes.includes('SEC-B') ? (isNeuralActive ? "none" : "2 1") : "4 4"}
                   />
                   <motion.path 
                    d="M150 40 L350 70 L380 180 L200 200 Z" 
                    fill="none" 
                    stroke="#FF5555" strokeWidth="1" strokeDasharray="4 2" className="opacity-40 animate-pulse"
                   />

                   {/* HEX SHIELDS (Visible when active) */}
                   <g className="opacity-20 pointer-events-none">
                      <defs>
                        <pattern id="hexagons" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                          <path d="M5 0 L10 2.88 L10 8.66 L5 11.54 L0 8.66 L0 2.88 Z" fill="none" stroke={isPowerRerouted ? "#F7C056" : "#3E4D3E"} strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#hexagons)" />
                   </g>
                   </g>

                   {/* Environmental Decor */}
                   <path d="M320 50 Q380 100 340 220" fill="none" stroke="#222" strokeWidth="5" className="opacity-10" />
                   <text x="325" y="45" fill="#313131" fontSize="4px" className="opacity-20">VALLEY RESERVOIR</text>

                   {/* Breach Points */}
                   {BREACH_POINTS.map(point => (
                    <g key={point.id}>
                      <circle cx={`${point.x}%`} cy={`${point.y}%`} r="2.5" fill="#C53030" className="opacity-10 animate-ping" />
                      <circle cx={`${point.x}%`} cy={`${point.y}%`} r="1" fill="#C53030" />
                    </g>
                  ))}
                </svg>

                {/* Personnel Markers */}
                {staff.map((person) => person.position && (
                  <motion.button
                    key={person.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: selectedStaff?.id === person.id ? 1.4 : 0.8 }}
                    onClick={() => { onPlaySound('tap'); setSelectedStaff(person); setSelectedDino(null); }}
                    className="absolute p-2 -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${person.position.x}%`, top: `${person.position.y}%` }}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full border border-white/40 ${person.active ? 'bg-biosyn-green shadow-[0_0_8px_rgba(62,77,62,1)]' : 'bg-gray-500'}`} />
                      <span className="text-[4px] font-mono whitespace-nowrap bg-black/60 px-1 rounded mt-0.5 text-white/60">{person.name.split(' ')[1]}</span>
                    </div>
                  </motion.button>
                ))}

                {/* Dino Markers */}
                {dinos.map((dino) => (
                  <motion.button
                    key={dino.id}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: selectedDino?.id === dino.id ? 1.4 : 1,
                      filter: selectedDino?.id === dino.id ? 'brightness(1.5)' : 'brightness(1)'
                    }}
                    onClick={() => handleMarkerClick(dino)}
                    className="absolute p-3 -translate-x-1/2 -translate-y-1/2 z-20 transition-all active:scale-95"
                    style={{ left: `${dino.position.x}%`, top: `${dino.position.y}%` }}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border border-white/20 flex items-center justify-center p-0.5 shadow-lg ${
                        dino.threatLevel === 'Extreme' ? 'bg-[#FF5555] animate-pulse shadow-[0_0_15px_rgba(255,85,85,0.6)]' :
                        dino.threatLevel === 'High' ? 'bg-biosyn-alert shadow-[0_0_10px_rgba(197,48,48,0.4)]' :
                        dino.threatLevel === 'Medium' ? 'bg-biosyn-amber shadow-[0_0_10px_rgba(247,192,86,0.3)]' :
                        'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                      }`}>
                      </div>
                      <div className="absolute top-full mt-1 px-1 py-0.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded text-[4px] font-black tracking-widest text-white whitespace-nowrap">
                        {dino.id}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Info Panel with Hyperloop Emergency Controls */}
            <div className="flex-1 md:flex-[1] bg-biosyn-surface p-5 flex flex-col overflow-hidden relative border-t md:border-t-0 md:border-l md:border-biosyn-border md:bg-black/20 pt-6 md:pt-8">
              {/* Quick Config Panel (Moved to Bottom to avoid overlap) */}
              <div className="absolute bottom-4 left-4 right-4 z-40">
                 <div className="bg-black/90 backdrop-blur-md border border-biosyn-border p-1.5 rounded-lg flex gap-2 shadow-2xl">
                    <button 
                      onClick={onToggleADS}
                      disabled={isEmergencyProtocol || isLockdown}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[7px] font-bold uppercase tracking-widest rounded transition-all ${isADSActive ? 'bg-biosyn-green/20 text-biosyn-green border border-biosyn-green/40' : 'bg-red-500/20 text-red-500 border border-red-500/40'} ${(isEmergencyProtocol || isLockdown) ? 'opacity-30 cursor-not-allowed saturate-0' : ''}`}
                    >
                      {isADSActive ? <Shield size={8} /> : <ShieldAlert size={8} />}
                      ADS
                    </button>
                    <button 
                      onClick={onToggleNeural}
                      disabled={isEmergencyProtocol || isLockdown}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[7px] font-bold uppercase tracking-widest rounded transition-all ${isNeuralActive ? 'bg-biosyn-amber/20 text-biosyn-amber border border-biosyn-amber/40' : 'bg-white/5 text-white/40 border border-white/10'} ${(isEmergencyProtocol || isLockdown) ? 'opacity-30 cursor-not-allowed saturate-0' : ''}`}
                    >
                      <Radio size={8} />
                      NEURAL
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="h-full pb-16 overflow-y-auto scrollbar-hide">
              {selectedDino ? (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className={`bg-black/40 border p-4 rounded-lg ${isLockdown ? 'border-biosyn-alert/30' : 'border-biosyn-border'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-[10px] font-bold uppercase ${isLockdown ? 'text-biosyn-alert' : 'text-biosyn-amber'}`}>Asset: {selectedDino.id}</h3>
                      <span className={`text-[8px] font-bold uppercase ${selectedDino.status === 'Breached' ? 'text-[#FF5555]' : 'text-biosyn-green'}`}>{selectedDino.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold text-white/70">
                      <div><span className="text-[7px] block opacity-40">Species</span>{selectedDino.species}</div>
                      <div><span className="text-[7px] block opacity-40">Risk</span><span className={
                        selectedDino.threatLevel === 'Extreme' ? 'text-biosyn-alert animate-pulse' :
                        selectedDino.threatLevel === 'High' ? 'text-biosyn-alert' :
                        selectedDino.threatLevel === 'Medium' ? 'text-biosyn-amber' :
                        'text-green-400'
                      }>{selectedDino.threatLevel}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleTag} className="flex-1 bg-biosyn-alert/10 text-[#FF5555] text-[9px] font-bold uppercase p-2 rounded border border-[#FF5555]/20">Status Update</button>
                    <button onClick={onOpenLogs} className="flex-1 bg-white/5 text-white/60 text-[9px] font-bold uppercase p-2 rounded border border-white/10">Telemetry</button>
                  </div>
                </motion.div>
              ) : selectedStaff ? (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <div className="bg-black/40 border border-biosyn-border p-4 rounded-lg">
                    <h3 className="text-[10px] font-bold uppercase text-biosyn-amber mb-2">Personnel: {selectedStaff.id}</h3>
                    <div className="text-[11px] font-bold text-white/90 uppercase">{selectedStaff.name}</div>
                    <div className="text-[9px] text-white/40 uppercase mb-4">{selectedStaff.role}</div>
                    <p className="text-[9px] opacity-60 italic">"{selectedStaff.details}"</p>
                  </div>
                  <button onClick={() => onAddLog(`Ping sent to ${selectedStaff.name}`, 'Warning')} className="w-full bg-biosyn-amber/10 text-biosyn-amber text-[9px] font-bold uppercase p-2 rounded border border-biosyn-amber/20">Send Emergency Ping</button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col space-y-4">
                  <div className={`p-4 rounded-lg border flex flex-col gap-3 ${isLockdown ? 'bg-biosyn-alert/5 border-biosyn-alert/20' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className={`text-[10px] md:text-[12px] font-bold uppercase ${isLockdown ? 'text-biosyn-alert' : 'text-biosyn-amber'}`}>GRID & TRANSPORT STATUS</h3>
                      <div className={`px-2 py-0.5 rounded text-[7px] md:text-[9px] font-black uppercase ${isHyperloopActive ? 'bg-biosyn-green text-black' : 'bg-biosyn-alert text-white'}`}>
                        {isHyperloopActive ? 'Operational' : 'Disabled'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                       <button 
                        onClick={onToggleHyperloop}
                        className={`flex flex-col items-center justify-center p-3 md:p-5 rounded border transition-all active:scale-95 ${isHyperloopActive ? 'bg-biosyn-alert/10 border-biosyn-alert/30 text-biosyn-alert' : 'bg-biosyn-green/10 border-biosyn-green/30 text-biosyn-green'}`}
                       >
                         <AlertTriangle size={14} className="mb-1 md:w-5 md:h-5" />
                         <span className="text-[7px] md:text-[9px] font-bold uppercase leading-none">{isHyperloopActive ? 'Emergency Shutdown' : 'Manual Reboot'}</span>
                       </button>
                       
                       <button 
                        onClick={onTogglePower}
                        className={`flex flex-col items-center justify-center p-3 md:p-5 rounded border transition-all active:scale-95 ${isPowerRerouted ? 'bg-biosyn-amber text-black border-biosyn-amber' : 'bg-white/5 border-white/10 text-white/60'}`}
                       >
                         <div className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border border-current flex items-center justify-center mb-1">
                           <span className="text-[6px] md:text-[8px] font-black">⚡</span>
                         </div>
                         <span className="text-[7px] md:text-[9px] font-bold uppercase leading-none">{isPowerRerouted ? 'Balanced Grid' : 'Reroute Power'}</span>
                       </button>
                    </div>

                    {!isHyperloopActive && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-2 border border-dashed border-biosyn-alert/40 rounded">
                        <p className="text-[8px] text-biosyn-alert font-bold uppercase animate-pulse">Critical: Evacuation required before re-boot</p>
                      </motion.div>
                    )}
                    
                    {isPowerRerouted && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-2 bg-biosyn-amber/10 rounded">
                        <p className="text-[7px] text-biosyn-amber uppercase">Priority: Perimeter Enclosures & Bio-Tracker Uplink</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                    <RadarIcon size={24} className="mb-2 opacity-20" />
                    <p className="text-[8px] uppercase font-bold tracking-widest leading-loose">No active tracking target.<br/>Configure Power Grid or Click Assets.</p>
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#080a08]">
             {dinos.map(dino => (
              <div key={dino.id} onClick={() => { onPlaySound('tap'); setSelectedDino(dino); setViewMode('MAP'); }} className="bg-biosyn-surface border border-biosyn-border p-4 rounded flex items-center gap-4 cursor-pointer hover:bg-biosyn-border/20 transition-colors">
                <div className={`w-1 h-8 rounded-full ${
                  dino.threatLevel === 'Extreme' ? 'bg-[#FF5555] animate-pulse' :
                  dino.threatLevel === 'High' ? 'bg-biosyn-alert' :
                  dino.threatLevel === 'Medium' ? 'bg-biosyn-amber' :
                  'bg-green-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[11px] font-bold uppercase">{dino.species}</h3>
                  <div className="flex gap-3 text-[7px] uppercase tracking-tighter opacity-40"><span>{dino.id}</span><span>{dino.status}</span><span className={
                    dino.threatLevel === 'Extreme' ? 'text-biosyn-alert animate-pulse' :
                    dino.threatLevel === 'High' ? 'text-biosyn-alert' :
                    dino.threatLevel === 'Medium' ? 'text-biosyn-amber' :
                    'text-green-400'
                  }>{dino.threatLevel}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SurveillanceApp({ cameras, isDamPowered, onRepair, onPlaySound }: { 
  cameras: Camera[], 
  isDamPowered: boolean,
  onRepair: (id: string) => void,
  onPlaySound: (type: 'tap' | 'alert' | 'success' | 'lockdown') => void
}) {
  const [selectedCam, setSelectedCam] = useState<Camera | null>(null);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-biosyn-surface overflow-hidden">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
            <Video className="text-biosyn-amber" />
            Videosorveglianza BioSyn
          </h2>
          <p className="text-[8px] text-white/40 uppercase tracking-tight font-mono">Feed Multicast // Criptazione 256-bit</p>
        </div>
        <div className="px-3 py-1 bg-black/40 border border-white/10 rounded flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isDamPowered ? 'bg-biosyn-green animate-pulse' : 'bg-biosyn-alert'}`} />
          <span className="text-[7px] font-bold uppercase tracking-widest">{isDamPowered ? 'Sistema Pronto' : 'Guasto Energetico'}</span>
        </div>
      </div>

      {!isDamPowered ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 border border-white/5 bg-black/20 rounded-2xl relative overflow-hidden">
           <div className="biosyn-static absolute inset-0 opacity-20" />
           <VideoOff size={48} className="text-white/20 relative z-10" />
           <p className="text-[10px] font-black tracking-widest uppercase text-white/40 relative z-10 italic">Segnale Perso: Rete Primaria Offline</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Main Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pr-1">
            {cameras.map((camera) => (
              <motion.div
                key={camera.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => { setSelectedCam(camera); onPlaySound('tap'); }}
                className={`aspect-video bg-black rounded-lg border relative group cursor-pointer overflow-hidden ${
                  camera.isOnline ? 'border-white/10' : 'border-biosyn-alert/40'
                }`}
              >
                {!camera.isOnline && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }} 
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-[10px] font-black text-biosyn-alert uppercase tracking-widest italic"
                    >
                      {['CAM-01', 'CAM-06'].includes(camera.id) ? 'DISMESSO' : 'OFFLINE'}
                    </motion.span>
                    {!['CAM-01', 'CAM-06'].includes(camera.id) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRepair(camera.id); onPlaySound('success'); }}
                        className="mt-2 px-2 py-0.5 bg-biosyn-alert/20 text-biosyn-alert text-[6px] font-bold uppercase rounded border border-biosyn-alert/40 hover:bg-biosyn-alert hover:text-black transition-colors"
                      >
                        Ripristina Feed
                      </button>
                    )}
                    {['CAM-01', 'CAM-06'].includes(camera.id) && (
                      <span className="mt-1 text-[5px] text-white/30 uppercase tracking-widest font-mono">Hardware Compromesso</span>
                    )}
                  </div>
                )}

                {/* Camera Overlay */}
                <div className="absolute inset-0 biosyn-static opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 biosyn-scanline opacity-[0.05] pointer-events-none" />
                
                <div className="absolute top-2 left-2 flex flex-col gap-0.5 z-10">
                   <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-sm rounded">
                      <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] ${camera.isOnline ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                      <span className="text-[6px] font-bold text-white/80 tracking-widest uppercase">{camera.name}</span>
                   </div>
                   <span className="text-[5px] font-mono text-white/30 uppercase pl-1">{camera.location}</span>
                </div>

                <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                   <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${camera.isOnline ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                      <span className="text-[5px] font-black text-white/40 tracking-tighter uppercase">REC</span>
                   </div>
                   <div className="text-[4px] font-mono text-white/20 uppercase tracking-tighter">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                   </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr-sm" />
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none" />

                {/* Viewport for generic "video" look */}
                <div className={`w-full h-full ${camera.isOnline ? 'bg-emerald-950/20' : 'bg-red-950/10'} flex items-center justify-center relative overflow-hidden`}>
                   {camera.isOnline ? (
                      <>
                         {camera.imageUrl && (
                            <img 
                               src={`${camera.imageUrl}&timestamp=${Date.now()}`} 
                               alt="Feed" 
                               className="absolute inset-0 w-full h-full object-cover animate-slow-pan opacity-60 grayscale-[0.4] contrast-[1.3] brightness-[0.9] sepia-[0.1]"
                               referrerPolicy="no-referrer"
                            />
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                         <div className="absolute inset-4 border-[0.5px] border-white/10 opacity-30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                         <div className="absolute bottom-2 right-2 text-[5px] font-mono text-white/20 tracking-tighter">
                            ISO 800 // F1.8 // 1/60s
                         </div>
                      </>
                   ) : (
                      <VideoOff size={16} className="text-white/5" />
                   )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center gap-4">
             <div className="flex-1">
                <div className="text-[8px] font-black uppercase text-biosyn-amber tracking-widest">Monitor Protocollo</div>
                <div className="text-[6px] text-white/40 uppercase font-mono mt-0.5">Rilevamento asset automatizzato: {cameras.filter(c => c.isOnline).length}/{cameras.length} Feed attivi</div>
             </div>
             <button 
                onClick={() => { cameras.forEach(c => !c.isOnline && !['CAM-01', 'CAM-06'].includes(c.id) && onRepair(c.id)); onPlaySound('success'); }}
                className="px-4 py-2 bg-biosyn-amber text-black text-[8px] font-black uppercase tracking-widest rounded-md hover:scale-105 transition-transform"
             >
                Ristabilisci Uplink Globale
             </button>
          </div>
        </div>
      )}

      {/* Expanded Feed Modal */}
      <AnimatePresence>
        {selectedCam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedCam(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl aspect-video bg-[#050505] rounded-3xl border border-white/10 relative overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
               {/* Video Feed Styling */}
               <div className="absolute inset-0 biosyn-static opacity-[0.05] pointer-events-none" />
               <div className="absolute inset-0 biosyn-scanline opacity-[0.08] pointer-events-none" />
               <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
               
               {/* UI Overlays */}
               <div className="relative z-10 p-6 flex-1 flex flex-col">
                  <div className="flex justify-between">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                           <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedCam.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{selectedCam.location} // SECTOR_BI-OSYN</span>
                     </div>
                     <div className="text-right flex flex-col gap-1">
                        <div className="text-[9px] font-bold text-biosyn-amber uppercase">REC [●] // LIVE FEED</div>
                        <div className="text-[7px] font-mono text-white/30 uppercase">05 MAY 2026 // {new Date().toLocaleTimeString()}</div>
                     </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                     {!selectedCam.isOnline ? (
                        <div className="flex flex-col items-center gap-2 z-20">
                           <VideoOff size={48} className="text-biosyn-alert animate-bounce" />
                           <span className="text-lg font-black text-biosyn-alert uppercase tracking-[0.5em] italic">SEGNALE INTERROTTO</span>
                        </div>
                     ) : (
                        <>
                           {selectedCam.imageUrl && (
                              <img 
                                 src={`${selectedCam.imageUrl}&timestamp=${Date.now()}`} 
                                 alt="Live Feed" 
                                 className="absolute inset-0 w-full h-full object-cover animate-slow-pan opacity-40 grayscale-[0.2] contrast-[1.2] brightness-[0.8]"
                                 referrerPolicy="no-referrer"
                              />
                           )}
                           <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent to-black/60 pointer-events-none" />
                           <div className="w-full max-w-sm h-px bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] relative overflow-hidden z-20">
                              <motion.div 
                                 animate={{ x: [-400, 400] }}
                                 transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                 className="absolute inset-y-0 w-24 bg-white/20"
                              />
                           </div>
                        </>
                     )}
                  </div>

                  <div className="flex justify-between items-end">
                     <div className="flex gap-4">
                        <div className="flex flex-col gap-1">
                           <span className="text-[6px] font-bold text-white/30 uppercase">Azimut</span>
                           <span className="text-[8px] font-mono">14.22.09</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[6px] font-bold text-white/30 uppercase">Elevazione</span>
                           <span className="text-[8px] font-mono">+05.21</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedCam(null)}
                          className="px-4 py-2 border border-white/20 text-white/60 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 rounded-lg transition-all"
                        >
                          Chiudi Feed
                        </button>
                        {!selectedCam.isOnline && (
                           <button 
                             onClick={() => onRepair(selectedCam.id)}
                             disabled={['CAM-01', 'CAM-06'].includes(selectedCam.id)}
                             className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${['CAM-01', 'CAM-06'].includes(selectedCam.id) ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed opacity-50' : 'bg-biosyn-alert text-black hover:scale-105'}`}
                           >
                             {['CAM-01', 'CAM-06'].includes(selectedCam.id) ? 'Hardware Error' : 'Ri-Sincronizza'}
                           </button>
                        )}
                     </div>
                  </div>
               </div>

               {/* Vignette */}
               <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PowerApp({ activePowerNodes, isPowerRerouted, onTogglePowerNode, onTogglePower, onPlaySound }: {
  activePowerNodes: string[],
  isPowerRerouted: boolean,
  onTogglePowerNode: (id: string) => void,
  onTogglePower: () => void,
  onPlaySound: (type: any) => void
}) {
  const nodes = [
    { id: 'DAM', x: 80, y: 70, name: 'Main Diga', type: 'Source', priority: 'Primary' },
    { id: 'HQ', x: 45, y: 45, name: 'HQ Ring', type: 'Hub', priority: 'Primary' },
    { id: 'CONTROL', x: 45, y: 40, name: 'Control Room', type: 'Sub', priority: 'Primary' },
    { id: 'LAB', x: 40, y: 35, name: 'Research Lab', type: 'Sub', priority: 'Primary' },
    { id: 'POST-A', x: 15, y: 30, name: 'Outpost A', type: 'Radar', priority: 'Primary' },
    { id: 'POST-B', x: 70, y: 20, name: 'Outpost B', type: 'Radar', priority: 'Primary' },
    { id: 'POST-C', x: 55, y: 65, name: 'Outpost C', type: 'Radar', priority: 'Primary' },
    { id: 'MINE', x: 30, y: 80, name: 'Amber Mines', type: 'Facility', priority: 'Secondary' },
    { id: 'AIR', x: 85, y: 15, name: 'Aerodromo', type: 'Transport', priority: 'Secondary' },
    { id: 'FOSSIL', x: 25, y: 15, name: 'Fossil Ctr', type: 'Science', priority: 'Secondary' },
  ];

  const currentLoad = activePowerNodes.reduce((acc, id) => acc + (POWER_COSTS[id] || 0), 0);
  const loadPercentage = (currentLoad / MAX_POWER_CAPACITY) * 100;
  const isOverloaded = currentLoad >= MAX_POWER_CAPACITY;

  const isDamPowered = activePowerNodes.includes('DAM');

  return (
    <div className="h-full bg-biosyn-surface p-4 md:p-8 flex flex-col md:flex-row gap-6 lg:gap-10 relative overflow-hidden">
      <div className="flex-1 flex flex-col space-y-4 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Zap className={isPowerRerouted ? "text-biosyn-amber animate-pulse" : "text-biosyn-amber"} size={18} />
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest">Power Grid Management</h2>
          </div>
          <div className="text-[10px] md:text-[12px] font-mono opacity-60">LOAD: {currentLoad}MW / {MAX_POWER_CAPACITY}MW</div>
        </div>
        <button 
          onClick={onTogglePower}
          className={`w-full md:w-auto px-4 py-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${isPowerRerouted ? 'bg-biosyn-amber text-black border-biosyn-amber' : 'border-biosyn-border text-biosyn-text opacity-40 hover:opacity-100'}`}
        >
          {isPowerRerouted ? 'RESTRICTED LOAD' : 'STANDARD LOAD'}
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[7px] uppercase font-bold tracking-widest mb-1 opacity-50">
          <span>Core Output Stability</span>
          <span>{Math.round(loadPercentage)}%</span>
        </div>
        <div className="h-2 bg-black/40 border border-biosyn-border rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(loadPercentage, 100)}%` }}
            className={`h-full transition-colors duration-500 ${loadPercentage > 90 ? 'bg-biosyn-alert' : loadPercentage > 70 ? 'bg-biosyn-amber' : 'bg-biosyn-green'}`}
          />
        </div>
        {loadPercentage > 95 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, 1, 0.5, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-[8px] font-bold text-biosyn-alert uppercase tracking-tighter text-center mt-1"
          >
            CRITICAL LOAD: SYSTEM SHEDDING ACTIVE
          </motion.div>
        )}
      </div>

      <div className="flex-1 bg-black/40 border border-biosyn-border rounded-xl relative overflow-hidden p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <filter id="glow">
               <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {nodes.map(node => (
            node.id !== 'DAM' && (
              <line 
                key={`line-${node.id}`}
                x1="80" y1="70" x2={node.x} y2={node.y}
                stroke={activePowerNodes.includes('DAM') && activePowerNodes.includes(node.id) ? (isPowerRerouted && node.priority === 'Secondary' ? '#111' : '#3E4D3E') : '#111'}
                strokeWidth="0.5"
                strokeDasharray="2 1"
              />
            )
          ))}

          {/* Power Nodes */}
          {nodes.map(node => {
            const isActive = activePowerNodes.includes(node.id);
            const isRestricted = isPowerRerouted && node.priority === 'Secondary';
            const isOffline = !isActive || isRestricted;
            
            return (
              <g 
                key={node.id} 
                className="cursor-pointer group" 
                onClick={() => { onPlaySound('tap'); onTogglePowerNode(node.id); }}
              >
                <circle 
                  cx={node.x} cy={node.y} r={node.id === 'DAM' ? 4 : 2.5} 
                  fill={isOffline ? '#C53030' : (isPowerRerouted ? '#F7C056' : '#3E4D3E')}
                  opacity={isOffline ? 0.3 : 1}
                  className="transition-all duration-300"
                  filter={!isOffline ? "url(#glow)" : ""}
                />
                <text x={node.x + 4} y={node.y + 1} fill="white" className="text-[3px] font-bold uppercase opacity-40 group-hover:opacity-100 transition-opacity tracking-tighter pointer-events-none">
                  {node.name}
                </text>
                {node.priority === 'Primary' && !isOffline && (
                  <circle cx={node.x} cy={node.y} r={4} fill="none" stroke="#F7C056" strokeWidth="0.1" opacity="0.3" className="animate-ping" />
                )}
              </g>
            );
          })}
        </svg>

        {isPowerRerouted && !isOverloaded && isDamPowered && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-biosyn-alert/20 border border-biosyn-alert/40 px-2 py-1 rounded">
             <Zap size={8} className="text-biosyn-alert animate-pulse" />
             <span className="text-[6px] font-bold text-biosyn-alert uppercase tracking-widest font-mono">Emergency Load: Non-Primary Subsystems Dropped</span>
          </div>
        )}

        {!isDamPowered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-2">
              <ZapOff size={24} className="text-biosyn-alert animate-bounce" />
              <span className="text-[10px] font-black text-biosyn-alert uppercase tracking-[0.3em] font-mono">Generator Error</span>
              <span className="text-[6px] text-white/40 uppercase font-bold">Restore DAM Connection to Initialize Grid</span>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="w-full md:w-[300px] lg:w-[400px] flex flex-col space-y-4">
        <div className="bg-black/20 p-4 border border-biosyn-border rounded-lg md:flex-1 md:overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-biosyn-amber mb-4">Node Telemetry</h3>
          <div className="space-y-2 overflow-y-auto pr-2 scrollbar-hide flex-1">
             {nodes.map(node => {
                const isActive = activePowerNodes.includes(node.id);
                const isRestricted = isPowerRerouted && node.priority === 'Secondary';
                const isPowerFlowing = isActive && !isRestricted;

                return (
                  <div key={node.id} className={`flex items-center justify-between p-3 rounded border ${isPowerFlowing ? 'bg-black/20 border-biosyn-border' : 'bg-red-950/10 border-red-900/30'}`}>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isPowerFlowing ? 'text-biosyn-text' : 'text-red-500'}`}>{node.name}</span>
                      <span className="text-[7px] opacity-40 uppercase">{node.type} • {node.priority} Priority</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-mono ${isPowerFlowing ? 'text-biosyn-green' : 'text-red-500'}`}>
                        {isPowerFlowing ? (isPowerRerouted && node.priority === 'Primary' ? 'BOOST' : 'ONLINE') : (isRestricted ? 'OFFLINE (SHED)' : 'LOST')}
                      </span>
                      <button 
                        onClick={() => onTogglePowerNode(node.id)}
                        className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${isActive ? 'bg-biosyn-amber text-black border-biosyn-amber' : 'bg-transparent border-white/10 text-white/40'}`}
                      >
                        {isActive ? <Zap size={12} /> : <ZapOff size={12} />}
                      </button>
                    </div>
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* Blackout Visual Indicator Overlay (Moved to end to cover full row in tablet) */}
      {!isDamPowered && (
        <motion.div 
          animate={{ opacity: [0.1, 0.4, 0.1] }} 
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute inset-0 bg-red-950 pointer-events-none z-0"
        />
      )}
    </div>
  );
}

function LogsApp({ logs }: { logs: SecurityEvent[] }) {
  return (
    <div className="p-5 space-y-4 flex flex-col h-full bg-[#0F110F]">
       <div className="flex justify-between items-center">
         <h2 className="text-xs font-bold uppercase tracking-widest">Security Subsystem</h2>
         <Search size={14} className="opacity-40" />
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-1 overflow-y-auto pr-1 scrollbar-hide">
         {logs.map((log) => (
           <motion.div 
             key={log.id} 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`bg-biosyn-surface p-4 md:p-6 border border-biosyn-border rounded shadow-sm h-fit ${log.type === 'Alert' ? 'border-l-4 border-l-biosyn-alert' : ''}`}
           >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] md:text-[11px] font-bold text-biosyn-amber uppercase tracking-tighter">{log.timestamp}</span>
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${log.type === 'Alert' ? 'text-[#FF5555]' : 'opacity-40'}`}>{log.type}</span>
              </div>
              <p className="text-[10px] md:text-[13px] opacity-80 leading-snug mb-2 font-mono uppercase tracking-tight">{log.message}</p>
              <div className="flex justify-between items-center text-[8px] md:text-[10px] uppercase tracking-wider opacity-30">
                 <span>Location: {log.location}</span>
                 <span>ID: {log.id}</span>
              </div>
           </motion.div>
         ))}
       </div>
    </div>
  );
}

function CommsApp({ onPlaySound }: { onPlaySound: (type: 'tap') => void }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'C. Dodgson', preview: 'The shipment is on its way. Ensure protocol.', time: '09:12', unread: true },
    { id: 2, sender: 'Dr. Wu', preview: 'Genome sequence 44-B shows stability concerns.', time: 'Yesterday', unread: false },
    { id: 3, sender: 'Security Team', preview: 'Shift change confirmed for Night Watch.', time: 'Yesterday', unread: false },
  ]);

  const markRead = (id: number) => {
    onPlaySound('tap');
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  return (
    <div className="p-5 h-full flex flex-col bg-[#0F110F]">
       <h2 className="text-xs font-bold uppercase tracking-widest mb-6">Secure Comms</h2>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 flex-1 overflow-y-auto">
         {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              layout
              onClick={() => markRead(msg.id)}
              className="group cursor-pointer bg-biosyn-surface p-4 md:p-6 border border-biosyn-border rounded-lg active:scale-[0.98] transition-all hover:bg-biosyn-border/10 h-fit"
            >
               <div className="flex justify-between items-start mb-2">
                 <span className={`text-[11px] md:text-[14px] font-bold uppercase tracking-wide ${msg.unread ? 'text-biosyn-amber' : 'opacity-80'}`}>{msg.sender}</span>
                 <span className="text-[8px] md:text-[10px] font-mono opacity-30 uppercase">{msg.time}</span>
               </div>
               <p className="text-[10px] md:text-[13px] opacity-60 leading-tight md:leading-normal line-clamp-3">{msg.preview}</p>
               {msg.unread && (
                  <div className="mt-3 h-0.5 w-full bg-biosyn-amber/20">
                     <motion.div layoutId={`unread-${msg.id}`} className="h-full bg-biosyn-amber w-1/4" />
                  </div>
               )}
            </motion.div>
         ))}
       </div>

       <div className="mt-8 opacity-10">
         <div className="h-[1px] w-full bg-white mb-2" />
         <p className="text-[8px] uppercase tracking-[0.4em] text-center">Encrypted by Biosyn Quantum Core</p>
       </div>
    </div>
  );
}

function PersonnelApp({ staff, onPlaySound, onLocate, isSafetyActive, onToggleSafety }: { 
  staff: Personnel[],
  onPlaySound: (type: 'tap' | 'alert' | 'success' | 'lockdown') => void,
  onLocate: (id: string) => void,
  isSafetyActive: boolean,
  onToggleSafety: () => void
}) {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const runManualScan = () => {
    onPlaySound('alert');
    // Manual scan logic will be triggered by a re-render or explicit action if needed, 
    // but for now we show feedback
  };

  return (
    <div className="p-5 overflow-y-auto h-full bg-[#0F110F] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest">Personnel Tracker</h2>
        <div className={`px-2 py-1 rounded border text-[7px] font-black tracking-tighter uppercase ${isSafetyActive ? 'bg-biosyn-green/10 border-biosyn-green text-biosyn-green' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
          Safety Protocol: {isSafetyActive ? 'Active' : 'Offline'}
        </div>
      </div>
      
      {/* Safety Protocol Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button 
          onClick={onToggleSafety}
          className={`flex items-center justify-center gap-2 p-3 border rounded text-[8px] font-bold uppercase transition-all ${isSafetyActive ? 'bg-biosyn-alert/10 border-biosyn-alert/30 text-biosyn-alert' : 'bg-biosyn-green/10 border-biosyn-green/30 text-biosyn-green'}`}
        >
          {isSafetyActive ? <ShieldOff size={12} /> : <Shield size={12} />}
          {isSafetyActive ? 'Disable Protocol' : 'Enable Protocol'}
        </button>
        <button 
          onClick={runManualScan}
          className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 text-white/60 rounded text-[8px] font-bold uppercase hover:bg-white/10"
        >
          <Search size={12} />
          Safety Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 flex-1 overflow-y-auto">
        {staff.map((person) => (
          <motion.div 
            key={person.id} 
            layout
            onClick={() => { onPlaySound('tap'); setSelectedStaff(selectedStaff === person.id ? null : person.id); }}
            className={`bg-biosyn-surface p-4 border border-biosyn-border rounded-lg relative overflow-hidden group cursor-pointer transition-colors ${selectedStaff === person.id ? 'bg-biosyn-border/10' : ''}`}
          >
            {person.active && (
               <div className="absolute top-0 right-0 p-1">
                  <div className="w-2 h-2 bg-biosyn-green rounded-full shadow-[0_0_8px_rgba(62,77,62,1)]" />
               </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-biosyn-border rounded flex items-center justify-center border border-white/5">
                <Users size={18} className="opacity-40" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start">
                   <h3 className="text-xs font-bold uppercase tracking-tight truncate">{person.name}</h3>
                   <span className="text-[8px] font-mono opacity-20">{person.id}</span>
                 </div>
                 <p className="text-[9px] opacity-40 uppercase tracking-tighter mb-2">{person.role}</p>
                 <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
                    <span className="opacity-20">Location</span>
                    <span className={person.status === 'Unknown' ? 'text-[#FF5555]' : 'text-biosyn-amber'}>{person.status}</span>
                 </div>
                 
                 <AnimatePresence>
                   {selectedStaff === person.id && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-biosyn-border/40 overflow-hidden"
                     >
                       <p className="text-[9px] opacity-70 italic leading-relaxed">{person.details}</p>
                       <div className="grid grid-cols-2 gap-2 mt-3">
                        <button className="bg-biosyn-amber/10 text-biosyn-amber text-[8px] font-bold uppercase p-2 rounded active:scale-95 transition-transform">Emergency Ping</button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onLocate(person.id); }}
                          className="bg-biosyn-green/10 text-biosyn-green text-[8px] font-bold uppercase p-2 rounded active:scale-95 transition-transform"
                        >
                          Locate on Map
                        </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
