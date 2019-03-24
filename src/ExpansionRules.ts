
class ExpansionRules {

    axiomCharacteracter : string;
    repString : string;
    prb : number;
    expMap: Map<string, Map<number, string>> = new Map<string, Map<number, string>>();

    constructor() {}

    setStartChar(){
      var charProbMap = this.expMap.get(this.axiomCharacteracter);
      charProbMap.set(this.prb, this.repString);
    }

    // ADD AN EXP RULE YIKE
    createExpRule(axiomCharacter: string, str: string, probability: number) {
      var charProbMap: Map<number, string> = new Map<number, string>();
        if (!this.expMap.has(axiomCharacter)) {
          charProbMap.set(probability, str);
          this.expMap.set(axiomCharacter, charProbMap);
        } else {
          this.axiomCharacteracter = axiomCharacter;
          this.repString = str;
          this.prb = probability;
          this.setStartChar();
        }

    }


    sumProbability(axiomCharacter: string) : string {

      var rand: number = Math.random();
      var cumulativeProb: number = 0.0;
      var expanded: string;
      var charProbMap: Map<number, string> = this.expMap.get(axiomCharacter);

      for (const prob of charProbMap.keys()) {
        var isRand = rand > cumulativeProb;
        var validRand = rand <= prob + cumulativeProb;
          if (isRand && validRand) {
              expanded = charProbMap.get(prob);
          }
          cumulativeProb = cumulativeProb + prob;
      }
      return expanded;
    }


    //function to get the fully expanded LSystem
    getExpansion(axiomCharacter: string): string {

      var hasChar = this.expMap.has(axiomCharacter);
      if (!hasChar){
        return '';
      }
      var finalString = this.sumProbability(axiomCharacter);
      return finalString;
    }


}

export default ExpansionRules;
