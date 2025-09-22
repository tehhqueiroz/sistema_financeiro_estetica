class VictoriaEstetica {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoadingScreen();
    this.setupNavigation();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupHeaderEffects();
    this.setupFormValidation();
    this.setupTestimonials();
    this.setupMicroInteractions();
    this.setupParallaxEffects();
    this.setupLazyLoading();
  }

  setupLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1500);
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('section[id]');
    const menuToggle = document.getElementById('alternarMenu');
    const navSite = document.getElementById('nav-site');

    menuToggle.addEventListener('click', () => {
      const isOpen = navSite.classList.toggle('aberto');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      
      this.animateHamburger(menuToggle, isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navSite.classList.remove('aberto');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const updateActiveSection = () => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          
          const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
            this.updateNavIndicator(activeLink, navIndicator);
          }
        }
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveSection();
  }

  updateNavIndicator(activeLink, indicator) {
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.closest('nav').getBoundingClientRect();
    
    indicator.style.left = `${linkRect.left - navRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.classList.add('active');
  }

  animateHamburger(button, isOpen) {
    const spans = button.querySelectorAll('.hamburger span');
    spans.forEach((span, index) => {
      if (isOpen) {
        span.style.transform = index === 0 ? 'rotate(45deg) translate(6px, 6px)' :
                              index === 1 ? 'scale(0)' :
                              'rotate(-45deg) translate(6px, -6px)';
      } else {
        span.style.transform = 'none';
      }
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          const children = entry.target.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-animate').forEach(section => {
      observer.observe(section);
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.cabecalho-site').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupHeaderEffects() {
    const header = document.querySelector('.cabecalho-site');

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  setupFormValidation() {
    const formulario = document.getElementById('formularioContato');
    const aviso = document.getElementById('aviso');

    const validators = {
      nome: (value) => {
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        return null;
      },
      email: (value) => {
        if (!value.trim()) return 'E-mail é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'E-mail inválido';
        return null;
      },
      mensagem: (value) => {
        if (!value.trim()) return 'Mensagem é obrigatória';
        if (value.trim().length < 10) return 'Mensagem deve ter pelo menos 10 caracteres';
        return null;
      }
    };

    const mostrarErro = (nome, msg) => {
      const campo = formulario.querySelector(`[name="${nome}"]`);
      const erro = formulario.querySelector(`.erro[data-for="${nome}"]`);
      
      if (erro) {
        erro.textContent = msg || '';
        erro.style.opacity = msg ? '1' : '0';
      }
      
      if (campo) {
        campo.style.borderColor = msg ? 'var(--error)' : 'rgba(0, 0, 0, 0.1)';
      }
    };

    const limparErros = () => {
      Object.keys(validators).forEach(nome => mostrarErro(nome, ''));
    };

    Object.keys(validators).forEach(nome => {
      const campo = formulario.querySelector(`[name="${nome}"]`);
      if (campo) {
        campo.addEventListener('blur', () => {
          const erro = validators[nome](campo.value);
          mostrarErro(nome, erro);
        });

        campo.addEventListener('input', () => {
          if (campo.style.borderColor === 'var(--error)') {
            const erro = validators[nome](campo.value);
            mostrarErro(nome, erro);
          }
        });
      }
    });

    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      limparErros();

      const formData = new FormData(formulario);
      let isValid = true;

      Object.keys(validators).forEach(nome => {
        const value = formData.get(nome);
        const erro = validators[nome](value);
        if (erro) {
          mostrarErro(nome, erro);
          isValid = false;
        }
      });

      if (isValid) {
        this.simulateFormSubmission(formulario, aviso);
      }
    });
  }

  simulateFormSubmission(formulario, aviso) {
    const submitBtn = formulario.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      formulario.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      aviso.style.display = 'block';
      aviso.style.opacity = '1';
      
      setTimeout(() => {
        aviso.style.opacity = '0';
        setTimeout(() => {
          aviso.style.display = 'none';
        }, 300);
      }, 3000);
    }, 2000);
  }

  setupTestimonials() {
    const depoimentos = [
      { 
        texto: '"Experiência impecável! Saí renovada. A Victoria explica tudo e monta um protocolo perfeito pra você."', 
        autor: '— Juliana M.' 
      },
      { 
        texto: '"A drenagem foi maravilhosa. Atendimento humano e ambiente super calmo."', 
        autor: '— Andrea M.' 
      },
      { 
        texto: '"Minha pele mudou real. Higiene, técnica e carinho."', 
        autor: '— Carla M.' 
      },
      { 
        texto: '"Profissional excepcional! Resultados que superaram minhas expectativas."', 
        autor: '— Maria S.' 
      }
    ];

    let indice = 0;
    const citacao = document.getElementById('citacao');
    const btnAnterior = document.getElementById('depoimentoAnterior');
    const btnProximo = document.getElementById('proximoDepoimento');

    const renderizarCitacao = () => {
      citacao.style.opacity = '0';
      citacao.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        citacao.innerHTML = `
          ${depoimentos[indice].texto}
          <footer>${depoimentos[indice].autor}</footer>
        `;
        citacao.style.opacity = '1';
        citacao.style.transform = 'translateY(0)';
      }, 200);
    };

    btnAnterior.addEventListener('click', () => {
      indice = (indice - 1 + depoimentos.length) % depoimentos.length;
      renderizarCitacao();
    });

    btnProximo.addEventListener('click', () => {
      indice = (indice + 1) % depoimentos.length;
      renderizarCitacao();
    });

    setInterval(() => {
      indice = (indice + 1) % depoimentos.length;
      renderizarCitacao();
    }, 5000);

    renderizarCitacao();
  }

  setupMicroInteractions() {
    document.querySelectorAll('.botao').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    document.querySelectorAll('.cartao').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    document.querySelectorAll('.servico').forEach(servico => {
      servico.addEventListener('click', () => {
        const serviceType = servico.getAttribute('data-service');
        this.showServiceModal(serviceType);
      });
      
      const icon = servico.querySelector('.servico-icon');
      if (icon) {
        servico.addEventListener('mouseenter', () => {
          icon.style.animation = 'pulse 1s infinite';
        });
        
        servico.addEventListener('mouseleave', () => {
          icon.style.animation = 'none';
        });
      }
    });

    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    this.typeWriterEffect();
  }

  showServiceModal(serviceType) {
    const services = {
      massagem: {
        title: 'Massagem Relaxante',
        description: 'Técnica suave que alivia tensões musculares, melhora a circulação e promove relaxamento profundo.',
        duration: '60 minutos',
        price: 'R$ 120',
        benefits: ['Alívio de tensões', 'Melhora do sono', 'Redução de estresse', 'Relaxamento profundo']
      },
      drenagem: {
        title: 'Drenagem Linfática',
        description: 'Técnica manual suave que auxilia na eliminação de líquidos e toxinas, melhorando o bem-estar geral.',
        duration: '45 minutos',
        price: 'R$ 100',
        benefits: ['Redução de inchaço', 'Melhora da circulação', 'Eliminação de toxinas', 'Bem-estar geral']
      },
      limpeza: {
        title: 'Limpeza de Pele',
        description: 'Protocolo completo de limpeza facial com extração, hidratação e finalização calmante.',
        duration: '50 minutos',
        price: 'R$ 80',
        benefits: ['Pele limpa e saudável', 'Redução de cravos', 'Hidratação profunda', 'Pele mais macia']
      },
      modeladora: {
        title: 'Massagem Modeladora',
        description: 'Manobras intensas aliadas a ativos específicos para contorno corporal e redução de medidas.',
        duration: '70 minutos',
        price: 'R$ 150',
        benefits: ['Contorno corporal', 'Redução de medidas', 'Melhora da textura', 'Resultados progressivos']
      }
    };

    const service = services[serviceType];
    if (service) {
      const modal = document.createElement('div');
      modal.className = 'service-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>${service.title}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <p>${service.description}</p>
            <div class="service-details">
              <div class="detail-item">
                <strong>Duração:</strong> ${service.duration}
              </div>
              <div class="detail-item">
                <strong>Investimento:</strong> ${service.price}
              </div>
            </div>
            <div class="service-benefits">
              <h4>Benefícios:</h4>
              <ul>
                ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-actions">
              <a href="#contato" class="botao botao-primario">Agendar Agora</a>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      
      setTimeout(() => modal.classList.add('show'), 10);
      
      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
          setTimeout(() => modal.remove(), 300);
        }
      });
    }
  }

  typeWriterEffect() {
    const title = document.querySelector('.destaque h1');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--brand)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 1000);
  }

 

  setupLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          img.onload = () => {
            img.style.opacity = '1';
          };
          
          img.onerror = () => {
            img.style.opacity = '1';
            img.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.color = '#64748b';
            img.style.fontSize = '14px';
            img.alt = 'Imagem não disponível';
          };
          
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
      
      img.onerror = () => {
        img.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#64748b';
        img.style.fontSize = '14px';
        img.alt = 'Imagem não disponível';
      };
    });
  }
}

class Utils {
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ano').textContent = new Date().getFullYear();
  
  new VictoriaEstetica();
  
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .campo-formulario.focused label {
      color: var(--brand);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}