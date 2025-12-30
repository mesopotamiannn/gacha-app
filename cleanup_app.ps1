$c = Get-Content src/App.tsx
$n = $c[0..33] + $c[322..($c.Count - 1)]
$n | Set-Content src/App.tsx -Encoding UTF8
