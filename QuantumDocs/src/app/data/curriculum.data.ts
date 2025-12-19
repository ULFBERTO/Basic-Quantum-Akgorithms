import { Course } from '../models/curriculum.model';

export const QUANTUM_ZERO_TO_HERO: Course = {
    id: 'quantum-zero-to-hero',
    title: 'Quantum Computing: Zero to Hero',
    description: 'Master Quantum Physics and Computing from scratch without advanced math.',
    modules: [
        {
            id: 'm1-intro',
            title: 'Module 1: The Quantum World',
            description: 'Understanding the basic principles of quantum mechanics conceptually.',
            icon: 'science',
            level: 'beginner',
            isLocked: false,
            lessons: [
                {
                    id: 'l1-particles',
                    title: 'Waves or Particles?',
                    description: 'The double-slit experiment explained simply.',
                    xpReward: 100,
                    isLocked: false,
                    content: [
                        {
                            id: 'c1-intro',
                            type: 'text',
                            data: `
# Welcome to the Quantum World
Imagine throwing a tennis ball at a wall with two slits. It goes through one or the other, right?
In the quantum world, things get weird. A "quantum particle" like an electron can go through **both slits at the same time**.

This is called **Superposition**.
              `
                        },
                        {
                            id: 'c2-video',
                            type: 'video',
                            data: 'https://www.youtube.com/embed/Q1YqgPAtzho', // Placeholder educational video
                            title: 'Dr. Quantum - Double Slit Experiment'
                        }
                    ],
                    quiz: [
                        {
                            id: 'q1',
                            question: 'In the double-slit experiment, what happens when we observe the electron?',
                            options: [
                                'It behaves like a wave',
                                'It behaves like a particle',
                                'It disappears',
                                'It turns into a tennis ball'
                            ],
                            correctAnswerIndex: 1,
                            explanation: 'Observation collapses the wave function, forcing the electron to choose a single path, behaving like a particle.'
                        }
                    ]
                },
                {
                    id: 'l2-qubits',
                    title: 'What is a Qubit?',
                    description: 'Meet the fundamental unit of quantum information.',
                    xpReward: 150,
                    isLocked: true,
                    content: [
                        {
                            id: 'c1-def',
                            type: 'text',
                            data: `
# Bits vs Qubits
- A classical **Bit** is either 0 OR 1. Like a light switch.
- A **Qubit** can be 0, 1, or a mixture of both (Superposition). Like a dimmer switch, but more complex.

Let's look at a Qubit representation using the **Bloch Sphere**.
              `
                        },
                        {
                            id: 'c2-interactive-bloch',
                            type: 'interactive',
                            title: 'Play with a Qubit',
                            data: 'bloch-sphere-demo',
                            meta: {
                                initialState: { theta: 0, phi: 0 },
                                allowInteraction: true
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 'm2-gates',
            title: 'Module 2: Talking to Qubits',
            description: 'How to manipulate quantum states using Gates.',
            icon: 'engineering',
            level: 'beginner',
            isLocked: true,
            lessons: [
                {
                    id: 'l1-x-gate',
                    title: 'The X-Gate (NOT Gate)',
                    description: 'Flipping the switch.',
                    xpReward: 150,
                    isLocked: true,
                    content: [
                        {
                            id: 'intro',
                            type: 'text',
                            data: 'The X-Gate is the quantum equivalent of a NOT gate. It turns 0 into 1, and 1 into 0.'
                        }
                    ]
                }
            ]
        }
    ]
};
