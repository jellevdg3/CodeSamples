Interpolation = function () { }

Interpolation.Lerp = function(v0, v1, t)
{
    return v0 * (1 - t) + v1 * t;
}

Interpolation.Lerp3 = function (v0, v1, t)
{
    return [v0[0] * (1 - t) + v1[0] * t, v0[1] * (1 - t) + v1[1] * t, v0[2] * (1 - t) + v1[2] * t];
}

Interpolation.Lerp3Quat = function (v0, v1, t)
{
    t *= t;
    return [v0[0] * (1 - t) + v1[0] * t, v0[1] * (1 - t) + v1[1] * t, v0[2] * (1 - t) + v1[2] * t];
}

Interpolation.Ease = function(t)
{
    var sqt = t * t;
    return sqt / (2.0 * (sqt - t) + 1.0);
}

Interpolation.LerpEase = function (v0, v1, t)
{
    return v0 * (1 - Interpolation.Ease(t)) + v1 * Interpolation.Ease(t);
}

Interpolation.LerpEase3 = function (v0, v1, t)
{
    t = Interpolation.Ease(t);
    return [v0[0] * (1 - t) + v1[0] * t, v0[1] * (1 - t) + v1[1] * t, v0[2] * (1 - t) + v1[2] * t];
}
