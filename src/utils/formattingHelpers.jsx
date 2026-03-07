import { InlineMath, BlockMath } from 'react-katex';

export function ital(str) {
    return <span className="taylor-italic">{str}</span>;
}

export function bold(str) {
    return <span className="taylor-bold">{str}</span>;
}

export function boldital(str) {
    return <span className="taylor-bold taylor-italic">{str}</span>;
}

export function mathy(str) {
    return <span className="taylor-mathy"><InlineMath math={str} /></span>;
}

export function latexblock(str) {
    return <span className="taylor-latexblock"><BlockMath math={str} /></span>
}