use std::error::Error;

use rand::Rng;

fn main() -> Result<(), Box<dyn Error>> {

    loop {
        print!(".");

        let pin : u32 = rand::thread_rng().gen_range(1_000_000..9_999_999);
    
        let resp = reqwest::blocking::get("https://kahoot.it/reserve/session/{pin}/")?.text()?;
        // println!("{:#?}", resp);
    
        if resp != "Not found" {
            println!("Found! {pin}");
        }

    }
}