/**
 * Google Analytics Utility
 * Tracks page views and events
 */

class Analytics {
  constructor() {
    this.initialized = false;
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  }

  /**
   * Initialize Google Analytics
   */
  init() {
    if (this.initialized || !this.measurementId) {
      console.log('📊 Analytics:', this.measurementId ? 'Already initialized' : 'No measurement ID provided');
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      send_page_view: false // We'll manually track page views
    });

    this.initialized = true;
    console.log('📊 Google Analytics initialized');
  }

  /**
   * Track page view
   * @param {string} path - Page path
   * @param {string} title - Page title
   */
  trackPageView(path, title) {
    if (!this.initialized || !window.gtag) {
      console.log('📊 [Test Mode] Page view:', path, title);
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title
    });
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {Object} params - Event parameters
   */
  trackEvent(eventName, params = {}) {
    if (!this.initialized || !window.gtag) {
      console.log('📊 [Test Mode] Event:', eventName, params);
      return;
    }

    window.gtag('event', eventName, params);
  }

  /**
   * Track booking events
   */
  trackBooking(service, date) {
    this.trackEvent('booking_created', {
      service: service,
      date: date,
      value: 1
    });
  }

  /**
   * Track button clicks
   */
  trackButtonClick(buttonName) {
    this.trackEvent('button_click', {
      button_name: buttonName
    });
  }
}

export const analytics = new Analytics();
