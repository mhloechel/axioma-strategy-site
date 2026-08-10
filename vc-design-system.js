/* @ds-bundle: {"format":4,"namespace":"AxiomaStrategyDesignSystem_6a33f1","components":[{"name":"PillarBadge","sourcePath":"components/badges/PillarBadge.jsx"},{"name":"StatCallout","sourcePath":"components/badges/StatCallout.jsx"},{"name":"CascadeDivider","sourcePath":"components/brand/CascadeDivider.jsx"},{"name":"FooterLegal","sourcePath":"components/brand/FooterLegal.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"BodyText","sourcePath":"components/typography/BodyText.jsx"},{"name":"Eyebrow","sourcePath":"components/typography/Eyebrow.jsx"},{"name":"Heading","sourcePath":"components/typography/Heading.jsx"}],"sourceHashes":{"components/badges/PillarBadge.jsx":"e04fda03d088","components/badges/StatCallout.jsx":"a66ac40c2f54","components/brand/CascadeDivider.jsx":"764c6adf9302","components/brand/FooterLegal.jsx":"a0c78be9f43f","components/brand/Wordmark.jsx":"c6f85ad58ee9","components/buttons/Button.jsx":"b0c9b5d18ffd","components/surfaces/Card.jsx":"cd2999fc8915","components/typography/BodyText.jsx":"45ed92c0fd21","components/typography/Eyebrow.jsx":"e2de1235fce7","components/typography/Heading.jsx":"0e8496c90d32"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AxiomaStrategyDesignSystem_6a33f1 = window.AxiomaStrategyDesignSystem_6a33f1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/badges/PillarBadge.jsx
try { (() => {
function PillarBadge({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: "var(--weight-body-strong)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--color-teal)",
      border: "1px solid var(--color-teal)",
      borderRadius: "var(--radius-pill)",
      padding: "6px 14px",
      display: "inline-block"
    }
  }, children);
}
Object.assign(__ds_scope, { PillarBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/PillarBadge.jsx", error: String((e && e.message) || e) }); }

// components/badges/StatCallout.jsx
try { (() => {
function StatCallout({
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: "180px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-display-bold)",
      fontSize: "var(--text-stat)",
      color: "var(--color-cyan)",
      lineHeight: 1.1
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: "var(--color-text-muted)",
      marginTop: "6px"
    }
  }, label));
}
Object.assign(__ds_scope, { StatCallout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/StatCallout.jsx", error: String((e && e.message) || e) }); }

// components/brand/CascadeDivider.jsx
try { (() => {
function CascadeDivider({
  steps = 5
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: "6px",
      height: "28px"
    }
  }, Array.from({
    length: steps
  }).map((_, i) => {
    const height = 8 + i * (20 / (steps - 1));
    const color = i % 2 === 0 ? "var(--color-teal)" : "var(--color-cyan)";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: "22px",
        height: height + "px",
        background: color,
        borderRadius: "2px",
        opacity: 0.4 + i / steps * 0.6
      }
    });
  }));
}
Object.assign(__ds_scope, { CascadeDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/CascadeDivider.jsx", error: String((e && e.message) || e) }); }

// components/brand/FooterLegal.jsx
try { (() => {
function FooterLegal() {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--color-text-muted)",
      margin: 0
    }
  }, "Axioma Strategy is a division of Axioma Group, Inc.");
}
Object.assign(__ds_scope, { FooterLegal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/FooterLegal.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function Wordmark({
  mark = "leaf"
}) {
  const src = mark === "flat" ? "axioma-mark.png" : "axioma-mark.png";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Axioma leaf mark",
    style: {
      height: "36px",
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "16px",
      color: "var(--color-text-primary)",
      letterSpacing: "0.01em"
    }
  }, "Michael H. Loechel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 400,
      fontSize: "12px",
      color: "var(--color-cyan)",
      letterSpacing: "var(--tracking-wordmark-sub)",
      textTransform: "uppercase"
    }
  }, "Axioma Strategy")));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  children,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const isPrimary = variant === "primary";
  const style = isPrimary ? {
    color: "var(--color-background)",
    background: hover ? "var(--color-cyan)" : "var(--color-teal)",
    border: "none"
  } : {
    color: hover ? "var(--color-cyan)" : "var(--color-text-primary)",
    background: "transparent",
    border: "1px solid " + (hover ? "var(--color-cyan)" : "var(--color-surface-border)")
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-body-strong)",
      fontSize: "14px",
      borderRadius: "var(--radius-sm)",
      padding: "12px 24px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-card)",
      borderRadius: "var(--radius-md)",
      padding: "24px"
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/typography/BodyText.jsx
try { (() => {
function BodyText({
  muted = false,
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-size)",
      lineHeight: "var(--leading-body)",
      color: muted ? "var(--color-text-muted)" : "var(--color-text-primary)",
      margin: 0
    }
  }, children);
}
Object.assign(__ds_scope, { BodyText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/BodyText.jsx", error: String((e && e.message) || e) }); }

// components/typography/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-eyebrow)",
      fontWeight: "var(--weight-body-strong)",
      letterSpacing: "var(--tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--color-cyan)"
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/typography/Heading.jsx
try { (() => {
const sizes = {
  1: "var(--text-h1)",
  2: "var(--text-h2)",
  3: "var(--text-h3)"
};
function Heading({
  level = 2,
  children
}) {
  const Tag = "h" + level;
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-display)",
      fontSize: sizes[level],
      lineHeight: "var(--leading-heading)",
      color: "var(--color-text-primary)",
      margin: 0
    }
  }, children);
}
Object.assign(__ds_scope, { Heading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Heading.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PillarBadge = __ds_scope.PillarBadge;

__ds_ns.StatCallout = __ds_scope.StatCallout;

__ds_ns.CascadeDivider = __ds_scope.CascadeDivider;

__ds_ns.FooterLegal = __ds_scope.FooterLegal;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.BodyText = __ds_scope.BodyText;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Heading = __ds_scope.Heading;

})();
