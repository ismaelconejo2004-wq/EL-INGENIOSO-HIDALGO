/* ===== VIS · escenas: qué fondo, hora, clima, props y reparto lleva cada una =====
   Formato: id|fondo|hora|clima|props|derecha|actuación|izquierda
   - hora: mediodia|amanecer|ocaso|noche|tarde (tarde = mediodía templado hacia ocaso)
   - clima: polvo, lluvia, lluvia_l, niebla, antorchas, luciernagas (separados por coma)
   - derecha: actores a la derecha, x*N repite
   - actuación vacía = la de ST (código original)
   - izquierda vacía = don Quijote (y Sancho, salvo que no proceda) */
(function (V) {
  'use strict';
  const T = `start|biblioteca|noche|||||alonso
yard|patio|amanecer|||rocinante_suelto|bow|
book|biblioteca|noche|||||alonso
sancho|cocina|tarde||||talk|
helmet|patio|amanecer|||rocinante_suelto|bow|
vision|entrepaginas|noche|||||alonso
road|camino|ocaso|polvo|||walk|
mills|molinos|mediodia|polvo|||fight|
adventure|camino|ocaso||cruz|cabrero|talk|
cabreros|majada|noche|luciernagas||cabrero*2|talk|
marcela|encinar|mediodia|||marcela+cabrero|watch|
sheep|llanura|mediodia|polvo||oveja*4|fight|
inn|venta|tarde|||ventero+maritornes|talk|
mambrino|camino|mediodia|lluvia_l||barbero|fight|
galeotes|camino|mediodia|polvo||galeote*3+soldado|talk|
sierra|sierra|tarde|||cardenio|watch|
toboso|plaza|noche|||aldonza+moza|talk|
duques|salon|tarde|||duque+duquesa|talk|
barataria|salon|mediodia||trono|labrador*2|talk|
booktrap|liza|noche||clavileno|duque+duquesa|fly|
avellaneda|ventainterior|tarde|||estudiante*2|talk|
impostor|camino|tarde|||impostor|talk|
tarfe|ventainterior|tarde||escribano|tarfe+escribano|talk|
barcelona|playa|mediodia|||moreno|talk|
home|plaza|ocaso|||ama+cura|talk|
end|alcoba|amanecer|||ama+cura|sleep|alonso
embajada|sierra|mediodia||||bow|
espejos|encinar|noche|||espejos|fight|
leones|camino|mediodia|polvo|carrojaula|leonero|watch|
camacho|plaza|mediodia||bodas|camacho+basilio+moza|watch|
barco|rio|mediodia||barca||fly|
desencanto|encinar|noche|niebla||merlin+duque|talk|
cabeza|casanoble|noche||cabeza|moreno|watch|
duelo|playa|amanecer|||blanca_luna|fight|
amor|plaza|ocaso|||aldonza|talk|
ateca|plaza|tarde|||clerigo|talk|
zaragoza|ciudad|mediodia||carteles|anselmo+soldado|watch|
siguenza|ciudad|mediodia||carteles|corregidor+alguacil|talk|
madrid|casanoble|tarde|||archipampano|talk|
toledo|calabozo|tarde||caldero|clerigo+tarfe|talk|
a_arg|plaza|tarde|||tarfe+cura|talk|
a_venta|venta|tarde|||ventero+moza|talk|
a_melonar|llanura|mediodia||melonar|carretero|talk|
a_azotado|calabozo|tarde|||galeote+alguacil|watch|
a_carlos|casanoble|noche||banquete|anselmo+bramidan|talk|
a_bracamonte|camino|tarde|||bracamonte|talk|
a_ermitano|sierra|tarde||ermita|ermitano|talk|
a_pinar|pinar|tarde|||barbara|talk|
a_estudiantes|camino|mediodia|||estudiante+comediante|talk|
a_alcala|ciudad|mediodia|||estudiante*2|talk|
a_archi|ciudad|tarde|||archipampano+alguacil|talk|
a_bramidan|casanoble|noche||banquete|bramidan|talk|
a_sancho|casanoble|noche||banquete|archipampano|eat|
a_sanchono|camino|tarde||||walk|
a_epilogo|calabozo|amanecer|||cura|talk|
ev_refran|camino|mediodia||||talk|
ev_tormenta|llanura|tarde|lluvia|||walk|
ev_viajero|camino|mediodia|polvo||arriero|talk|
ev_noche|majada|noche|luciernagas|||sleep|
ev_rocin|vado|mediodia||||plantado|
ev_faint|llanura|mediodia||||faint|
ev_fever|entrepaginas|noche||||faint|
vizcaino|camino|mediodia|polvo|coche|vizcaino+dama|fight|
batanes|batanes|noche||||watch|
dorotea|encinar|mediodia|||dorotea+cardenio|talk|
montesinos|cueva|tarde||||bow|
retablo|ventainterior|tarde||retablo|titiritero|watch|
lecho|alcoba|tarde|||ama+cura|sleep|alonso
salida|camino|amanecer||||walk|
ev_adios|camino|ocaso||||walk|
yangueses|vado|mediodia|||arriero*2+yegua|fight|
manteo|venta|noche||manta|maritornes+arriero|toss|
encamisados|camino|noche|antorchas||encamisado*3|fight|
cardenio|sierra|tarde|||cardenio|talk|
curioso|ventainterior|noche|||cura+anselmo|talk|
cautivo|ventainterior|noche|||zoraida|talk|
jaula|camino|tarde||carrojaula|canonigo+cura|talk|
disciplinantes|camino|tarde|||penitente*2+clerigo|fight|
sanson|plaza|mediodia|||sanson+teresa|talk|
muerte|camino|tarde||carreta|muerte+comediante|talk|
gaban|camino|mediodia|||diego|talk|
lorenzo|casanoble|tarde|||diego+estudiante|talk|
trifaldi|salon|tarde|||duena+duque|talk|
rodriguez|alcoba|noche|||duena+altisidora|talk|
ricote|camino|tarde|||ricote+peregrino|talk|
tosilos|liza|mediodia|polvo||tosilos|fight|
claudia|pinar|tarde|||claudia|talk|
roque|pinar|tarde|||roque+bandolero|talk|
galeras|playa|mediodia||galeras|ana+ricote+soldado|talk|
arcadia|llanura|ocaso|||cabrero+oveja*2|talk|
cerdos|camino|noche|polvo||cerdo*3|fight|
altisidora|salon|noche||catafalco|altisidora+duque+duquesa|talk|
ev_ladrones|camino|tarde|||bandolero*2|fight|
ev_caida|llanura|mediodia||pedregal||faint|
ev_aguas|llanura|mediodia||charco|oveja*2|watch|
ev_cabrero_med|llanura|tarde|||cabrero|talk|
ev_calentura|majada|noche||||sleep|
ev_c_hambre|llanura|mediodia||||bow|
ev_c_locura|entrepaginas|noche||||bow|
ev_c_honor|venta|ocaso|||ventero+arriero|talk|
ev_c_sancho|camino|ocaso||||talk|
ev_c_salud|camino|mediodia||||bow|
ev_deshonra|plaza|ocaso|||estudiante*2|talk|
ev_muerte|camino|ocaso||||faint|
ev_locura|entrepaginas|noche||||bow|
ev_barca|rio|tarde|lluvia_l|barca||watch|
ev_puente|camino|mediodia||puente|alguacil|talk|
ev_pregonero|plaza|mediodia|||pregonero|talk|
ev_bandolero|pinar|tarde|||bandolero|talk|
ev_pescador|playa|mediodia|||pescador|talk|
ev_moza|camino|mediodia|||moza|bow|
ev_niebla|llanura|amanecer|niebla|||walk|
ev_lluvia|vado|tarde|lluvia|||watch|
ev_rucio|majada|noche||||talk|
ev_peregrinos|camino|mediodia|||peregrino*2|talk|
torneo|plaza|mediodia|polvo||estudiante+cabrero|toss|
sancho_cuenta|camino|tarde||||talk|
diego_frio|casanoble|tarde|||diego|talk|
cirujano|plaza|mediodia|||barbero|talk|`;
  const E = {};
  T.split('\n').forEach(l => {
    const p = l.split('|');
    E[p[0]] = { f: p[1], h: p[2] === 'tarde' ? 'mediodia' : p[2], tarde: p[2] === 'tarde', clima: p[3] ? p[3].split(',') : [], props: p[4] ? p[4].split(',') : [], r: p[5] ? p[5].split('+') : [], an: p[6] || '', l: p[7] || 'dq' };
  });
  // Región → variante del camino real
  const REG = { bar: 'costa', zar: 'ribera', ate: 'ribera', ari: 'ribera', sig: 'ribera', mad: 'olivar', tol: 'olivar', alc: 'olivar', sie: 'olivar' };
  V.ESC = E;
  V.escena = function (id) {
    let e = E[id];
    if (!e) e = { f: 'camino', h: 'mediodia', clima: [], props: [], r: [], an: '', l: 'dq' };
    const st = (typeof stOf === 'function') ? stOf(id) : { an: 'watch' };
    const reg = (typeof loc === 'function') ? loc(id) : 'arg';
    return Object.assign({}, e, { an: e.an || st.an || 'watch', cap: st.cap || '', variante: REG[reg] || 'mancha', reg });
  };
})(VIS);
