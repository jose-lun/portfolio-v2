import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath } from 'react-katex';
import { parseEquation, matchTokens } from './equationParser';
import 'katex/dist/katex.min.css';

/**
 * AlgebraicStepper - A component for showing step-by-step algebraic derivations
 * with smooth animations between steps.
 * 
 * @param {Array} steps - Array of step objects with structure:
 *   {
 *     equation: string (LaTeX),
 *     explanation: string,
 *     highlights?: Array<{ pattern: string, color: string, index?: number }>
 *       OR
 *     highlights?: Object { "pattern": "color" }
 *   }
 */
export default function AlgebraicStepper({ steps }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        padding: '20px',
        alignItems: 'start',
      }}
    >
      {/* Left: Explanation */}
      <StepExplanation
        explanation={step.explanation}
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
      />

      {/* Right: Equation + Controls */}
      <div>
        <EquationDisplay
          equation={step.equation}
          highlights={step.highlights}
          prevEquation={currentStep > 0 ? steps[currentStep - 1].equation : null}
        />
        <StepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
}

function StepExplanation({ explanation, stepNumber, totalSteps }) {
  return (
    <div style={{ paddingTop: '20px' }}>
      <div
        style={{
          fontSize: '14px',
          color: '#999',
          marginBottom: '10px',
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        STEP {stepNumber} OF {totalSteps}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stepNumber}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.1 }}
          style={{
            fontSize: '20px',
            lineHeight: '1.6',
            color: '#e9ecf2',
          }}
        >
          {explanation}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EquationDisplay({ equation, prevEquation, highlights = [] }) {
  const tokens = parseEquation(equation);
  const prevTokens = prevEquation ? parseEquation(prevEquation) : [];
  const matchedTokens = prevTokens.length > 0 ? matchTokens(prevTokens, tokens) : tokens;

  // Build highlight color map for object-based highlighting
  const highlightMap = {};
  if (highlights && typeof highlights === 'object' && !Array.isArray(highlights)) {
    Object.assign(highlightMap, highlights);
  }

  // Helper to get color for a single token and increment counter
  const getColorForToken = (tokenContent, occurrenceIndices) => {
    const cleanContent = tokenContent.replace(/\s+/g, '');

    if (!Array.isArray(highlights)) {
      return '#e9ecf2';
    }

    if (occurrenceIndices[cleanContent] === undefined) {
      occurrenceIndices[cleanContent] = 0;
    }

    const thisOccurrenceIndex = occurrenceIndices[cleanContent];

    // console.log(`Checking token: "${tokenContent}" (clean: "${cleanContent}"), occurrence index: ${thisOccurrenceIndex}`);

    let matchColor = '#e9ecf2';
    let foundMatch = false;

    for (const h of highlights) {
      const cleanPattern = h.pattern.replace(/\s+/g, '');

      if (cleanContent === cleanPattern) {
        foundMatch = true;  // ✅ Set this as soon as pattern matches!
        // console.log(`  ✓ Pattern match! pattern="${h.pattern}" (clean: "${cleanPattern}"), target index=${h.index}, current index=${thisOccurrenceIndex}`);

        if (h.index === undefined || h.index === thisOccurrenceIndex) {
          matchColor = h.color;
          // console.log(`    → COLOR MATCH! Using color: ${h.color}`);
          break;  // Break after finding a matching index
        } else {
          // console.log(`    → Index mismatch, continuing to check next entry`);
        }
      }
    }

    if (foundMatch) {
      occurrenceIndices[cleanContent]++;
      // console.log(`  Incrementing "${cleanContent}" counter to ${occurrenceIndices[cleanContent]}`);
    }

    // console.log(`  Final color: ${matchColor}\n`);
    return matchColor;
  };

  // Helper to color ALL tokens in a fraction part
  const colorFractionPart = (latexContent, occurrenceIndices) => {
    const partTokens = parseEquation(latexContent);

    // Build colored version by wrapping each token individually
    let result = '';

    for (let i = 0; i < partTokens.length; i++) {
      const pt = partTokens[i];

      // Get color for this specific token
      const color = getColorForToken(pt.content, occurrenceIndices);

      // Add space between tokens if not first token
      if (i > 0) {
        result += ' ';
      }

      // Wrap in color if needed - use braces to limit scope!
      if (color !== '#e9ecf2') {
        result += `{\\color{${color}}${pt.content}}`;
      } else {
        result += pt.content;
      }
    }

    return result;
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '30px',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="popLayout">
          {(() => {
            // Initialize FRESH occurrence indices for THIS render only
            const occurrenceIndices = {};

            return matchedTokens.map((token, i) => {
              const isNew = token.layoutId?.startsWith('new_');

              // Special handling for fractions
              if (token.type === 'fraction') {
                const coloredNum = colorFractionPart(token.numerator, occurrenceIndices);
                const coloredDen = colorFractionPart(token.denominator, occurrenceIndices);

                // console.log('Fraction numerator result:', coloredNum);
                // console.log('Fraction denominator result:', coloredDen);

                return (
                  <motion.span
                    key={token.id}
                    initial={isNew ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.2 },
                    }}
                    style={{
                      display: 'inline-block',
                      fontSize: '20px',
                    }}
                  >
                    <InlineMath>
                      {`\\frac{${coloredNum}}{${coloredDen}}`}
                    </InlineMath>
                  </motion.span>
                );
              }

              // Regular tokens
              const color = getColorForToken(token.content, occurrenceIndices);

              return (
                <motion.span
                  key={token.id}
                  initial={isNew ? { opacity: 0 } : false}
                  animate={{
                    opacity: 1,
                    color: color,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    color: { duration: 0.3 },
                  }}
                  style={{
                    display: 'inline-block',
                    fontSize: '20px',
                  }}
                >
                  <InlineMath>{token.content}</InlineMath>
                </motion.span>
              );
            });
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepControls({ currentStep, totalSteps, onNext, onPrev }) {
  return (
    <div style={{ marginTop: '24px' }}>
      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          style={{
            flex: 1,
            padding: '12px 20px',
            background: currentStep === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            color: currentStep === 0 ? '#666' : '#e9ecf2',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
          onMouseEnter={(e) => {
            if (currentStep !== 0) {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentStep !== 0) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
          }}
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          style={{
            flex: 1,
            padding: '12px 20px',
            background:
              currentStep === totalSteps - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(198, 107, 255, 0.15)',
            border:
              currentStep === totalSteps - 1
                ? '1px solid rgba(255, 255, 255, 0.15)'
                : '1px solid rgba(198, 107, 255, 0.3)',
            borderRadius: '8px',
            color: currentStep === totalSteps - 1 ? '#666' : '#c66bff',
            cursor: currentStep === totalSteps - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
          onMouseEnter={(e) => {
            if (currentStep !== totalSteps - 1) {
              e.target.style.background = 'rgba(198, 107, 255, 0.25)';
              e.target.style.borderColor = 'rgba(198, 107, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentStep !== totalSteps - 1) {
              e.target.style.background = 'rgba(198, 107, 255, 0.15)';
              e.target.style.borderColor = 'rgba(198, 107, 255, 0.3)';
            }
          }}
        >
          Next Step →
        </button>
      </div>

      {/* Progress Indicators */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === currentStep ? 24 : 8,
              background: i === currentStep ? '#c66bff' : 'rgba(255, 255, 255, 0.2)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              height: 8,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}