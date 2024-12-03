document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('data-href');
      
      if (href === 'abhidhamma' || href === 'sutta' || href === 'vinaya' || href === 'changelog') {
        // Scroll to the section
        const section = document.getElementById(href);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = 'https://w3dhamma.github.io/w3demo/error';
        }
      } else {
        // Redirect to error page for undefined links
        window.location.href = 'https://w3dhamma.github.io/w3demo/error';
      }
    });
  });
});

