<template>
  <v-container fluid>
    <v-data-iterator
      :items="photos"
      :items-per-page.sync="photosPerPage"
      :page="page"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar fixed class="indigo" dark>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select          
              v-model="height"
              flat             
              hide-details
              clearable
              :items="heightKeys"
              label="Filter by Height"
            ></v-select>
            <v-spacer></v-spacer>
            <v-select           
              v-model="width"
              flat            
              hide-details
              clearable
              :items="widthKeys"
              label="Filter by Width"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="grayscale" mandatory>
              <v-btn large depressed class="purple yellow--text" :value="false">Color</v-btn>
              <v-btn large depressed class="white black--text" :value="true">Grayscale</v-btn>
            </v-btn-toggle>
          </template>
          <v-snackbar v-model="photosSnackbar" color="red">
            {{ photosSnackbarText }}
            <v-btn color="black" text @click="photosSnackbar = false">Close</v-btn>
          </v-snackbar>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="photo in props.items" :key="photo.id" cols="12" sm="6" md="4" lg="3">
            <v-card flat tile class="d-flex">
              <v-img :src="photo.url" aspect-ratio="1" class="grey lighten-2" :id="photo.id">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Photos per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="primary" class="ml-2" v-on="on">
                {{ photosPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in photosPerPageArray"
                :key="index"
                @click="updatePhotosPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Page {{ page }}</span>
          <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import PhotosService from "@/services/PhotosService";
export default {
  data() {
    return {
      photosPerPageArray: [4, 8, 12],
      photos: [],
      height: 0,
      width: 0,
      grayscale: false,
      page: 1,
      photosPerPage: 4,
      heightKeys: [],
      widthKeys: [],
      photosSnackbar: false,
      photosSnackbarText: ""
    };
  },

  methods: {
    nextPage() {
      if (this.photos.length >= this.photosPerPage) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updatePhotosPerPage(number) {
      this.photosPerPage = number;
    },
    async getPhotos() {
      await PhotosService.getPhotos({
        grayscale: this.grayscale,
        height: this.height || 0,
        width: this.width || 0,
        photosPerPage: this.photosPerPage,
        page: this.page
      })
        .then(res => {
          this.photos = res.data.photos;
        })
        .catch(err => {
          this.photosSnackbar = true;
          this.photosSnackbarText = err.message;
        });
    }
  },
  watch: {
    width: function() {
      this.page = 1;
      this.getPhotos();
    },
    height: function() {
      this.page = 1;
      this.getPhotos();
    },
    photosPerPage: function() {
      this.page = 1;
      this.getPhotos();
    },
    page: function() {
      this.getPhotos();
    },
    grayscale: function() {
      this.getPhotos();
    }
  },
  async mounted() {
    await PhotosService.getPhotos({
      grayscale: this.grayscale,
      height: this.height || 0,
      width: this.width || 0,
      photosPerPage: this.photosPerPage,
      page: this.page
    })
      .then(res => {
        this.photos = res.data.photos;

        this.heightKeys = res.data.heightKeys;
        this.widthKeys = res.data.widthKeys;

        this.heightKeys.sort();
        this.widthKeys.sort();
      })
      .catch(err => {
        this.photosSnackbar = true;
        this.photosSnackbarText = err.message;
      });
  }
};
</script>

