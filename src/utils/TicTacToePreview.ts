import { createCanvas } from 'canvas';

export default function ticTacToePreview(board: string[][]) {
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.fillStyle = '#1a302c';
    ctx.fillRect(0, 0, 300, 300);
    ctx.strokeStyle = "#3750a8"
    // create a 3x3 grid with lines
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 100);
        ctx.lineTo(300, i * 100);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * 100, 0);
        ctx.lineTo(i * 100, 300);
        ctx.stroke();
    }

    // draw an X if a square is A or an O if a square is B
    ctx.strokeStyle = '#ffffff'
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 'A') {
                ctx.beginPath();
                ctx.moveTo(j * 100 + 30, i * 100 + 30);
                ctx.lineTo(j * 100 + 70, i * 100 + 70);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(j * 100 + 70, i * 100 + 30);
                ctx.lineTo(j * 100 + 30, i * 100 + 70);
                ctx.stroke();
            } else if (cell === 'B') {
                ctx.beginPath();
                ctx.arc(j * 100 + 50, i * 100 + 50, 30, 0, 2 * Math.PI);
                ctx.stroke();
            }
        })
    })


    // get png url
    const pngUrl = canvas.toDataURL('image/png');
    return pngUrl;
}