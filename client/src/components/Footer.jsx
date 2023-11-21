import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="site-footer">
        <div class="container">
          <div class="site-footer-inner">
            <div class="brand footer-brand">
              <a href="/">
                <img
                  class="header-logo-image"
                  src="../images/logo.svg"
                  alt="Logo"
                />
              </a>
            </div>
            <ul class="footer-links list-reset">
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                Contact:
                <a
                  target="_blank"
                  href="https://www.linkedin.com/in/miroslav-pejic-976a07101/"
                >
                  Miroslav Pejic
                </a>
              </li>
            </ul>
            <ul class="footer-social-links list-reset">
              <li>
                <a target="_blank" href="https://discord.gg/rgGYfeYW3N">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Forum</title>
                    <path
                      d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
                      fill="#0270D7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a target="_blank" href="https://www.facebook.com/mirotalk">
                  <span class="screen-reader-text">Facebook</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"
                      fill="#0270D7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=_IVn2aINYww"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"
                      fill="#0270D7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a target="_blank" href="mailto:miroslav.pejic.85@gmail.com">
                  <span class="screen-reader-text">Google</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z"
                      fill="#0270D7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="github-button"
                  href="https://github.com/sponsors/miroslavpejic85"
                  data-color-scheme="no-preference: light; light: light; dark: dark;"
                  data-icon="octicon-heart"
                  data-size="large"
                  aria-label="Sponsor @miroslavpejic85 on GitHub"
                >
                  Sponsor
                </a>
              </li>
              <li>
                <a
                  class="github-button"
                  href="https://github.com/miroslavpejic85/mirotalksfu"
                  data-color-scheme="no-preference: light; light: light; dark: dark;"
                  data-size="large"
                  data-show-count="true"
                  aria-label="Star miroslavpejic85/mirotalk on GitHub"
                >
                  Star
                </a>
              </li>
            </ul>
            <div class="footer-copyright">
              &copy; 2023 MiroTalk SFU, all rights reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;