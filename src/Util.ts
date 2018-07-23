function intersect( a,b )
{
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function random(min, max) {
    return Math.round(Math.random() * (max - 1)) + parseInt(min, 10);
  }

export { random,intersect };
