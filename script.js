document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const cursor = document.getElementById('cursor');
    const intro = document.getElementById('intro');
    const main = document.getElementById('main');

    const lines = [
        'Initializing system...',
        'Loading kernel modules...',
        'Establishing secure connection...',
        'Decrypting user data...',
        'Access granted.',
        'Welcome to Karla Alvarez\'s Page.',
        'Booting main interface...'
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeWriter() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                output.textContent += lines[lineIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                output.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 500);
            }
        } else {
            setTimeout(() => {
                intro.style.display = 'none';
                main.style.display = 'block';
                initThreeJS();
                initTerminal();
            }, 1000);
        }
    }

    function initTerminal() {
        const output = document.getElementById('terminal-output');
        const input = document.getElementById('terminal-input');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                input.value = '';
                output.textContent += `\n> ${command}\n`;
                processCommand(command);
                output.scrollTop = output.scrollHeight;
            }
        });

        function processCommand(cmd) {
            const facts = [
                "Cybersecurity fact: Phishing attacks account for 90% of data breaches.",
                "Cybersecurity fact: The first computer virus was created in 1983 and was called 'Elk Cloner'.",
                "Cybersecurity fact: Multi-factor authentication can block 99.9% of account compromise attacks.",
                "Cybersecurity fact: There are over 1 billion malware programs in existence.",
                "Cybersecurity fact: The average cost of a data breach is $4.45 million.",
                "Cybersecurity fact: 95% of cybersecurity breaches are due to human error.",
                "Cybersecurity fact: Encryption is one of the most effective ways to protect data.",
                "Cybersecurity fact: The term 'hacker' originally meant someone skilled in programming, not a criminal."
            ];

            switch (cmd.toLowerCase()) {
                case 'help':
                    output.textContent += 'Available commands: help, about, hobbies, contact, fact, clear\n';
                    break;
                case 'about':
                    output.textContent += 'Karla Alvarez: Cybersecurity student passionate about ethical hacking and tech.\n';
                    break;
                case 'hobbies':
                    output.textContent += 'Check out my hobbies by clicking Hobbies in the nav.\n';
                    break;
                case 'contact':
                    output.textContent += 'Email: karla.alvarez@stu.bcc.cuny.edu\n';
                    break;
                case 'fact':
                    const randomFact = facts[Math.floor(Math.random() * facts.length)];
                    output.textContent += randomFact + '\n';
                    break;
                case 'clear':
                    output.textContent = 'Terminal cleared.\n';
                    break;
                default:
                    output.textContent += `Command not found: ${cmd}. Try 'help' for commands.\n`;
            }
        }

        // Nav functionality
        const navButtons = document.querySelectorAll('nav button');
        const modals = {
            hobbies: document.getElementById('hobbies-modal'),
            contact: document.getElementById('contact-modal'),
            'terminal-prompt': document.getElementById('terminal-modal'),
            video: document.getElementById('video-modal')
        };

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const section = button.getAttribute('data-section');
                modals[section].style.display = 'block';
            });
        });

        // Close modals
        Object.values(modals).forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    typeWriter();

    function initThreeJS() {
        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        const numChars = 100;
        const sprites = [];

        for (let i = 0; i < numChars; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;
            context.font = '48px monospace';
            context.fillStyle = '#00ff00';
            context.fillText(char, 0, 48);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.set((Math.random() - 0.5) * 20, Math.random() * 20 + 10, (Math.random() - 0.5) * 10);
            sprite.speed = Math.random() * 0.1 + 0.05;
            scene.add(sprite);
            sprites.push(sprite);
        }

        camera.position.set(0, 5, 10);

        function animate() {
            requestAnimationFrame(animate);

            sprites.forEach(sprite => {
                sprite.position.y -= sprite.speed;
                if (sprite.position.y < -10) {
                    sprite.position.y = 20;
                    sprite.position.x = (Math.random() - 0.5) * 20;
                    // Update char
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    const canvas = sprite.material.map.image;
                    const context = canvas.getContext('2d');
                    context.clearRect(0, 0, 64, 64);
                    context.fillText(char, 0, 48);
                    sprite.material.map.needsUpdate = true;
                }
            });

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});