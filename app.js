function get_random_value(max, min){
  return Math.floor(Math.random() * (max - min)) + min
}


//Vue app
const app = Vue.createApp({
  data(){
    return {
      player_health: 100,
      monster_health: 100,
      current_round: 0,
      winner: null,
      log_messages: []
    }
  },
  computed: {
    monster_bar_style(){
      if (this.monster_health < 0){
        return { width: '0%' }
      }
      return { width: this.monster_health + '%' }
    },
    player_bar_style(){
      if (this.player_health < 0){
        return { width: '0%' }
      }
      return { width: this.player_health + '%' }
    },
    check_round_special_attack_monster(){
      return this.current_round % 3 !== 0;
    },
    calc_log_messages(){
      return this.log_messages
    }
  },
  methods: {
    attack_monster(){
      this.current_round++;
      const attack_value = get_random_value(15, 5);
      this.monster_health -= attack_value;
      this.add_log_message('player', 'attack', attack_value);
      this.attack_player();
    },
    attack_player(){
      const attack_value = get_random_value(18, 5);
      this.player_health -= attack_value;
      this.add_log_message('monster', 'attack', attack_value);
    },
    special_attack_monster(){
      this.current_round++;
      const attack_value = get_random_value(25, 10);
      this.monster_health -= attack_value;
      this.add_log_message('player', 'special-attack', attack_value);
      this.attack_player();
    },
    heal_player(){
      this.current_round++;
      const heal_value = get_random_value(20, 8);
      if (this.player_health + heal_value > 100){
        this.player_health = 100;
      } else {
        this.player_health += heal_value;
      }
      this.add_log_message('player', 'heal', heal_value);
      this.attack_player();
    },
    surrender(){
      this.winner = 'monster';
    },
    new_game(){
      this.player_health = 100,
      this.monster_health = 100,
      this.current_round = 0,
      this.winner = null,
      this.log_messages = []
    },
    add_log_message(who, what, value){
      this.log_messages.unshift({ 
        action_by: who,
        action_type: what,
        action_value: value,
      });
    }
  },
  watch: {
    player_health(value){
      if (value <= 0 && this.monster_health <= 0){
        this.winner = 'draw';
      } else if (value <= 0){
        this.winner = 'monster';
      }
    },
    monster_health(value){
      if (value <= 0 && this.player_health <= 0){
        this.winner = 'draw';
      } else if (value <= 0){
        this.winner = 'player';
      }
    }
  }
});

app.mount('#game');