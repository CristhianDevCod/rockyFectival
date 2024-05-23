
const { src, dest, watch, series, parallel } = require('gulp');

//  Dependencias de CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//  Dependencias de Imágenes
const webp = require('gulp-webp');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const avif = require('gulp-avif');

//  Dependencias de JavaScript
const terser = require('gulp-terser-js');

// Compilar archivos .scss a css
function compilarSass (callback){
    src('src/scss/**/*.scss')
        .pipe( sourcemaps.init() )
        .pipe( plumber() )
        .pipe( sass() )
        .pipe( postcss([ autoprefixer(), cssnano()]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest("build/css") )
    callback()
}

// Aligerar las imágenes
function imagenes(callback){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones)))
        .pipe( dest('build/img'))
    callback();
}

//  Convertir formato de imágenes a webp
function versionWebp(callback){
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}') 
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
    callback();
}

//  Convertir formato de imágenes a avif
function versionAvif(callback){
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}') 
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    callback();
}

// Compila el archivo de JavaScript
function javaScript(callback){
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/js') )
    callback();
}

//  habilitar el watch para observar los cambios
function observarCambios(callback){
    watch('src/scss/**/*.scss',compilarSass);
    watch('src/js/**/*.js',javaScript);
    console.log('presiona Ctrl + C para finalizar');
    callback();
}

exports.compilarSass = compilarSass;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.javaScript = javaScript;
exports.observarCambios = parallel(imagenes, versionWebp, versionAvif, javaScript, observarCambios) ;
exports.default = series(compilarSass, observarCambios);

/*
function compilarSass (callback){
    src('src/scss//.scss') Identificar el archivo de SASS
    //  la funcion de src identifica el archivo
    .pipe( sass() )//  Compilar el archivo
    //  Luego .pipe() se ejecuta despues, aplicando sass()
    .pipe( dest("build/css") )//  Almacenarlo en el disco duro 

    callback() // Callback que avisa a gulp cuando finaliza su ejecución 
}
*/