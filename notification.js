var directions = {
  x: ['left', 'center', 'right'],
  y: ['top', 'bottom'],
};

var defaults = {
  position: ['bottom', 'center'],
  cssAnimation: 'vn-fade',
  width: 600,
  speed: 500,
  duration: 2000,
  delay: 0,
  max: 3,
  classes: 'vue-notification',
  animation: 'css',
  ignoreDuplicates: false,
  closeOnClick: true
};

function listToDirection(value) {
  if (typeof value === 'string') {
    value = split(value);
  }
  var x, y = null;

  value.forEach(function (v) {
    if (directions.y.indexOf(v) !== -1) {
      y = v;
    }
    if (directions.x.indexOf(v) !== -1) {
      x = v;
    }
  });

  return {
    x: x,
    y: y
  };
}

function split(value) {
  if (typeof value !== 'string') {
    return [];
  }
  return value.split(/\s+/gi).filter(function (v) {
    return v;
  });
}

Vue.component('CssGroup', {
  name: 'CssGroup',
  template: "<transition-group :name=\"name\"><slot/></transition-group>",
  props: ['name']
});

Vue.component('Notification', {
  template: '#notif-template',
  name: 'Notification',
  props: {
    group: {
      type: String,
      default: ''
    },
    width: {
      type: [Number],
      default: defaults.width
    },
    reverse: {
      type: Boolean,
      default: false
    },
    position: {
      type: [String, Array],
      default: function () {
        return defaults.position;
      }
    },
    classes: {
      type: String,
      default: defaults.classes
    },
    animationType: {
      type: String,
      default: defaults.animation
    },
    animation: {
      type: [Object, String],
      default: function () {
        return defaults.cssAnimation;
      }
    },
    speed: {
      type: Number,
      default: defaults.speed
    },
    duration: {
      type: Number,
      default: defaults.duration
    },
    delay: {
      type: Number,
      default: defaults.delay
    },
    max: {
      type: Number,
      default: defaults.max
    },
    ignoreDuplicates: {
      type: Boolean,
      default: defaults.ignoreDuplicates
    },
    closeOnClick: {
      type: Boolean,
      default: defaults.closeOnClick
    }
  },
  data: function () {
    return {
      list: [],
      componentName: 'CssGroup',
      animationName: 'css',
      notifIndex: 0
    };
  },
  mounted: function () {
    this.$root.$on('notif', this.addItem);
  },
  created: function() {
        var notify = function(params) {
          if (typeof params === 'string') {
            params = { title: '', text: params };
          }
    
          if (typeof params === 'object') {
            this.$root.$emit('notif', params);
          }
        };
    
        var name = 'notify';
    
        Vue.prototype['$' + name] = notify;
        Vue[name] = notify;
  },
  computed: {
    styles: function () {
      var direction = listToDirection(this.position);
      var width = this.width;
      var suffix = 'px';

      var styles = {
        width: width + suffix,
      };

      styles[direction.y] = '0px';

      if (direction.x === 'center') {
        styles.left = 'calc(50% - ' + width / 2 + suffix + ')';
      } else {
        styles[direction.x] = '0px';
      }

      return styles;
    },
    active: function () {
      return this.list.filter(function (v) {
        return v.isShown;
      });
    },
    botToTop: function () {
      return this.styles.hasOwnProperty('bottom');
    },
  },
  methods: {
    destroyIfNecessary: function (item) {
      if (this.closeOnClick) {
        this.destroy(item);
      }
    },
    addItem: function(event) {
      event.group = event.group || '';
      var self = this;

      if (this.group !== event.group) {
        return;
      }

      if (event.clean || event.clear) {
        this.destroyAll();
        return;
      }

      var duration = typeof event.duration === 'number' ?
        event.duration : this.duration;
      var speed = typeof event.speed === 'number' ?
        event.speed : this.speed;

      var item = {
        id: this.notifIndex++,
        title: event.title,
        text: event.text,
        type: event.type,
        isShown: true,
        speed: speed,
        length: duration + 2 * speed,
        data: event.data
      };

      if (duration >= 0) {
        item.timer = setTimeout(function() {
          self.destroy(item);
        }, item.length);
      }

      var direction = this.reverse ? !this.botToTop : this.botToTop;
      var indexToDestroy = -1;

      var isDuplicate = Boolean(this.active.find(function(item) { return item.title === event.title && item.text === event.text; } ));
      var canAdd = this.ignoreDuplicates ? !isDuplicate : true;

      if (!canAdd) return;

      if (direction) {
        this.list.push(item);

        if (this.active.length > this.max) {
          indexToDestroy = 0;
        }
      } else {
        this.list.unshift(item);

        if (this.active.length > this.max) {
          indexToDestroy = this.active.length - 1;
        }
      }

      if (indexToDestroy !== -1) {
        this.destroy(this.active[indexToDestroy]);
      }
    },

    notifyClass: function(item) {
      return [
        'vue-notification-template',
        this.classes,
        item.type
      ];
    },

    notifyWrapperStyle: function(item) {
      return {
        transition: 'all ' + item.speed + 'ms'
      };
    },

    destroy: function(item) {
      clearTimeout(item.timer);
      item.isShown = false;
      // Remove it right away
      this.list.splice(item, 1);
      // Check if anything else has to be cleaned up
      this.clean();
    },

    destroyAll: function() {
      this.active.forEach(this.destroy);
    },

    clean: function() {
      this.list = this.list.filter(function(v) { return !v.isShown; });
    }
  }
});