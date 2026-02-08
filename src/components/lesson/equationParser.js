/**
 * Enhanced equation parser for complex LaTeX structures
 * Handles fractions, nested braces, \left/\right pairs, and more
 */

export function parseEquation(latex) {
  const tokens = [];
  let i = 0;
  let id = 0;

  while (i < latex.length) {
    // Skip whitespace
    if (latex[i] === ' ') {
      i++;
      continue;
    }

    const result = parseNext(latex, i, id);
    if (result) {
      tokens.push(result.token);
      i = result.nextIndex;
      id = result.nextId;
    } else {
      i++;
    }
  }

  return tokens;
}

function parseNext(latex, startIndex, startId) {
  let i = startIndex;

  // Handle LaTeX commands
  if (latex[i] === '\\') {
    return parseCommand(latex, i, startId);
  }

  // Handle opening braces (group)
  if (latex[i] === '{') {
    return parseGroup(latex, i, startId);
  }

  // Handle operators
  if (['+', '-', '='].includes(latex[i])) {
    return {
      token: {
        type: 'operator',
        content: latex[i],
        id: `op_${startId}`,
        display: latex[i]
      },
      nextIndex: i + 1,
      nextId: startId + 1
    };
  }

  // Handle parentheses (not \left/\right)
  if (['(', ')'].includes(latex[i]) && (i === 0 || latex.substring(Math.max(0, i - 5), i) !== '\\left' && latex.substring(Math.max(0, i - 6), i) !== '\\right')) {
    return {
      token: {
        type: 'paren',
        content: latex[i],
        id: `paren_${startId}`,
        display: latex[i]
      },
      nextIndex: i + 1,
      nextId: startId + 1
    };
  }

  // Handle variables/numbers with subscripts and superscripts
  if (/[a-zA-Z0-9]/.test(latex[i])) {
    return parseVariable(latex, i, startId);
  }

  return null;
}

function parseCommand(latex, startIndex, startId) {
  let i = startIndex + 1; // skip \
  let j = i;

  // Get command name
  while (j < latex.length && /[a-zA-Z]/.test(latex[j])) {
    j++;
  }
  const commandName = latex.substring(startIndex, j);

  // Handle \left and \right
  if (commandName === '\\left' || commandName === '\\right') {
    // Get the delimiter
    const delimiter = latex[j];
    return {
      token: {
        type: commandName === '\\left' ? 'left-delim' : 'right-delim',
        content: commandName + delimiter,
        id: `delim_${startId}`,
        display: delimiter
      },
      nextIndex: j + 1,
      nextId: startId + 1
    };
  }

  // Handle \frac{numerator}{denominator}
  if (commandName === '\\frac') {
    const numerator = extractBraceContent(latex, j);
    const denominator = extractBraceContent(latex, numerator.endIndex);
    
    return {
      token: {
        type: 'fraction',
        content: `\\frac${numerator.content}${denominator.content}`,
        id: `frac_${startId}`,
        display: `\\frac${numerator.content}${denominator.content}`,
        numerator: numerator.inner,
        denominator: denominator.inner
      },
      nextIndex: denominator.endIndex,
      nextId: startId + 1
    };
  }

  // Handle \sqrt{content} or \sqrt[n]{content}
  if (commandName === '\\sqrt') {
    let options = '';
    let optEndIndex = j;
    
    // Check for optional argument [n]
    if (latex[j] === '[') {
      const optResult = extractBracketContent(latex, j);
      options = optResult.content;
      optEndIndex = optResult.endIndex;
    }
    
    const content = extractBraceContent(latex, optEndIndex);
    
    return {
      token: {
        type: 'sqrt',
        content: `\\sqrt${options}${content.content}`,
        id: `sqrt_${startId}`,
        display: `\\sqrt${options}${content.content}`,
        inner: content.inner
      },
      nextIndex: content.endIndex,
      nextId: startId + 1
    };
  }

  // Handle other commands like \cdot, \times, etc
  if (['\\cdot', '\\times', '\\div', '\\pm', '\\mp'].includes(commandName)) {
    return {
      token: {
        type: 'operator',
        content: commandName,
        id: `op_${startId}`,
        display: commandName
      },
      nextIndex: j,
      nextId: startId + 1
    };
  }

  // Handle text commands like \text{}
  if (commandName === '\\text') {
    const content = extractBraceContent(latex, j);
    return {
      token: {
        type: 'text',
        content: `\\text${content.content}`,
        id: `text_${startId}`,
        display: `\\text${content.content}`
      },
      nextIndex: content.endIndex,
      nextId: startId + 1
    };
  }

  // Generic command
  return {
    token: {
      type: 'command',
      content: commandName,
      id: `cmd_${startId}`,
      display: commandName
    },
    nextIndex: j,
    nextId: startId + 1
  };
}

function parseVariable(latex, startIndex, startId) {
  let i = startIndex;
  let content = '';

  // Get base variable/number
  while (i < latex.length && /[a-zA-Z0-9]/.test(latex[i])) {
    content += latex[i];
    i++;
  }

  // Check for subscript
  if (i < latex.length && latex[i] === '_') {
    i++; // skip _
    if (latex[i] === '{') {
      const sub = extractBraceContent(latex, i);
      content += '_' + sub.content;
      i = sub.endIndex;
    } else if (/[a-zA-Z0-9]/.test(latex[i])) {
      content += '_' + latex[i];
      i++;
    }
  }

  // Check for superscript
  if (i < latex.length && latex[i] === '^') {
    i++; // skip ^
    if (latex[i] === '{') {
      const sup = extractBraceContent(latex, i);
      content += '^' + sup.content;
      i = sup.endIndex;
    } else if (/[a-zA-Z0-9]/.test(latex[i])) {
      content += '^' + latex[i];
      i++;
    }
  }

  return {
    token: {
      type: 'term',
      content: content,
      id: `term_${startId}`,
      display: content
    },
    nextIndex: i,
    nextId: startId + 1
  };
}

function parseGroup(latex, startIndex, startId) {
  const result = extractBraceContent(latex, startIndex);
  
  return {
    token: {
      type: 'group',
      content: result.content,
      id: `group_${startId}`,
      display: result.content,
      inner: result.inner
    },
    nextIndex: result.endIndex,
    nextId: startId + 1
  };
}

function extractBraceContent(latex, startIndex) {
  if (latex[startIndex] !== '{') {
    return { content: '', inner: '', endIndex: startIndex };
  }

  let i = startIndex + 1;
  let depth = 1;
  let inner = '';

  while (i < latex.length && depth > 0) {
    if (latex[i] === '\\') {
      inner += latex[i] + (latex[i + 1] || '');
      i += 2;
      continue;
    }
    if (latex[i] === '{') depth++;
    if (latex[i] === '}') depth--;
    if (depth > 0) inner += latex[i];
    i++;
  }

  return {
    content: '{' + inner + '}',
    inner: inner,
    endIndex: i
  };
}

function extractBracketContent(latex, startIndex) {
  if (latex[startIndex] !== '[') {
    return { content: '', inner: '', endIndex: startIndex };
  }

  let i = startIndex + 1;
  let inner = '';

  while (i < latex.length && latex[i] !== ']') {
    inner += latex[i];
    i++;
  }

  return {
    content: '[' + inner + ']',
    inner: inner,
    endIndex: i + 1
  };
}

/**
 * Match tokens between two equations to create stable IDs for animations
 * Uses content-based matching with fallback to position-based matching
 */
export function matchTokens(prevTokens, nextTokens) {
  const matched = nextTokens.map(token => ({ ...token }));
  const usedPrevIds = new Set();

  // First pass: exact content match
  matched.forEach(token => {
    const prevMatch = prevTokens.find(
      prev => !usedPrevIds.has(prev.id) && 
              prev.content === token.content && 
              prev.type === token.type
    );
    
    if (prevMatch) {
      token.layoutId = prevMatch.layoutId || prevMatch.id;
      usedPrevIds.add(prevMatch.id);
    }
  });

  // Second pass: similar content match (for terms that slightly changed)
  matched.forEach(token => {
    if (token.layoutId) return;

    const prevMatch = prevTokens.find(
      prev => !usedPrevIds.has(prev.id) && 
              prev.type === token.type &&
              areSimilar(prev.content, token.content)
    );
    
    if (prevMatch) {
      token.layoutId = prevMatch.layoutId || prevMatch.id;
      usedPrevIds.add(prevMatch.id);
    } else {
      // New token
      token.layoutId = `new_${token.id}`;
    }
  });

  return matched;
}

function areSimilar(str1, str2) {
  // Check if terms share a base variable (e.g., "x_n" and "x_{n+1}")
  const base1 = str1.match(/^[a-zA-Z]+/)?.[0];
  const base2 = str2.match(/^[a-zA-Z]+/)?.[0];
  
  return base1 && base2 && base1 === base2;
}

/**
 * Helper to create semantic IDs for specific terms (optional advanced feature)
 */
export function createSemanticId(token, context = '') {
  // You can extend this to create more meaningful IDs based on context
  // For example: "x_n" -> "population_n", "r" -> "growth_rate"
  return `${context}_${token.content.replace(/[^a-zA-Z0-9]/g, '_')}`;
}