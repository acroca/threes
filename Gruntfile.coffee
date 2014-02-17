module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-sass"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.initConfig
    coffee:
      main:
        src: "script.coffee"
        dest: "script.js"

    sass:
      main:
        src: "stylesheet.scss"
        dest: "stylesheet.css"

    watch:
      css:
        files: ["stylesheet.scss"]
        tasks: ["sass:main"]
      js:
        files: ["script.coffee"]
        tasks: ["coffee:main"]

  grunt.registerTask "default", ["coffee:main", "sass:main", "watch"]
