import gulp from "gulp"
import fileInclude from "gulp-file-include"

const mainPath = "webapp/html/main.html"
const mainPathDist = "webapp/"

gulp.task('bundle-html', ()=> {
    return gulp.src([mainPath])
    .pipe(
        fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
    .pipe(gulp.dest(mainPathDist))
    
})

 gulp.task('default', gulp.series('bundle-html'));