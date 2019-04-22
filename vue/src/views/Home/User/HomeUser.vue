<template>
    <div class="contentWrapper">
        <h1>Seznam projektov</h1>
        <ProjectCard :is-admin="false" @goInsideProject="goInsideProject" :insertedProjectList="projectsList"/>
    </div>
</template>

<script>
    import HomeUserSprint from "./Project/HomeUserSprint";
    import ProjectCard from "../../../components/Generic/ProjectCard";
    import {APICalls} from "../../../utils/apiCalls";
    export default {
        name: 'homeUser',
        components: {
            ProjectCard,
            HomeUserSprint
        },
        created(){
            this.getAllProjects();
        },
        data: () => ({
            active: null,
            projectsList: []
        }),
        methods: {
            getAllProjects() {
                APICalls.getProjectBasedOnUserId(this.$store.getters.currentUser._id).then(
                    (rs) => {
                        this.projectsList = rs.data;
                    },
                    (error) => {
                    }
                );
            },

            goInsideProject(selectedProject){
            	console.log(selectedProject._id);

                this.$router.push(
                    {
                        name: 'homeUserProject',
                        params: {
                            projectId: selectedProject._id
                        }
                    }
                );
            }
        }
    }
</script>